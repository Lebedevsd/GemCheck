#!/usr/bin/env python3
"""
Resize a screenshot to 1280x800 for the Chrome Web Store.
Centres the image on a dark (#0d1117) background.

Usage:
  python3 scripts/gen_screenshot.py <source.png>
  python3 scripts/gen_screenshot.py          # auto-detects newest PNG in project root
"""
import glob
import os
import struct
import sys
import zlib

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT = os.path.join(ROOT, 'assets', 'screenshot_store.png')
TW, TH = 1280, 800
BG_COLOR = (0x0d, 0x11, 0x17)  # panel background


def find_newest_screenshot():
    patterns = ['brave_*.png', 'Screenshot*.png', 'screenshot*.png']
    candidates = []
    for p in patterns:
        candidates.extend(glob.glob(os.path.join(ROOT, p)))
    if not candidates:
        print('ERROR: no screenshot found in project root.', file=sys.stderr)
        print('Pass the path explicitly: python3 scripts/gen_screenshot.py <file.png>', file=sys.stderr)
        sys.exit(1)
    return max(candidates, key=os.path.getmtime)


def read_png(path):
    with open(path, 'rb') as f:
        data = f.read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n', 'Not a PNG file'
    pos = 8; chunks = {}
    while pos < len(data):
        length = struct.unpack('>I', data[pos:pos+4])[0]
        ctype = data[pos+4:pos+8]; cdata = data[pos+8:pos+8+length]
        pos += 12 + length
        chunks.setdefault(ctype, []).append(cdata)
    w, h, bd, ct, comp, filt, inter = struct.unpack('>IIBBBBB', chunks[b'IHDR'][0])
    raw = zlib.decompress(b''.join(chunks[b'IDAT']))
    bpp = [1, 0, 3, 1, 2, 0, 4][ct]
    stride = w * bpp
    pixels = []; i = 0
    for y in range(h):
        f = raw[i]; i += 1; row = list(raw[i:i+stride]); i += stride
        if f == 1:
            for x in range(bpp, len(row)): row[x] = (row[x] + row[x-bpp]) & 255
        elif f == 2:
            if y > 0:
                for x in range(len(row)): row[x] = (row[x] + pixels[y-1][x]) & 255
        elif f == 3:
            for x in range(len(row)):
                a = row[x-bpp] if x >= bpp else 0
                b2 = pixels[y-1][x] if y > 0 else 0
                row[x] = (row[x] + (a + b2) // 2) & 255
        elif f == 4:
            for x in range(len(row)):
                a = row[x-bpp] if x >= bpp else 0
                b2 = pixels[y-1][x] if y > 0 else 0
                c2 = pixels[y-1][x-bpp] if (y > 0 and x >= bpp) else 0
                pa = abs(b2-c2); pb = abs(a-c2); pc = abs(a+b2-2*c2)
                pr = a if pa <= pb and pa <= pc else (b2 if pb <= pc else c2)
                row[x] = (row[x] + pr) & 255
        pixels.append(row)
    return w, h, bpp, ct, pixels


def write_png(path, w, h, bpp, ct, pixels):
    def chunk(t, d):
        c = zlib.crc32(t + d) & 0xffffffff
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', c)
    raw = b''.join(b'\x00' + bytes(row) for row in pixels)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, ct, 0, 0, 0)
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', ihdr))
        f.write(chunk(b'IDAT', zlib.compress(raw, 9)))
        f.write(chunk(b'IEND', b''))


def resize(pixels, sw, sh, bpp, dw, dh):
    out = []
    for y in range(dh):
        row = []; sy = y * sh / dh; y0, y1 = int(sy), min(int(sy)+1, sh-1); fy = sy - y0
        for x in range(dw):
            sx = x * sw / dw; x0, x1 = int(sx), min(int(sx)+1, sw-1); fx = sx - x0
            for c in range(bpp):
                p00 = pixels[y0][x0*bpp+c]; p01 = pixels[y0][x1*bpp+c]
                p10 = pixels[y1][x0*bpp+c]; p11 = pixels[y1][x1*bpp+c]
                row.append(int(p00*(1-fx)*(1-fy) + p01*fx*(1-fy) + p10*(1-fx)*fy + p11*fx*fy + .5))
        out.append(row)
    return out


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else find_newest_screenshot()
    src = os.path.abspath(src)

    print(f'source : {os.path.basename(src)}')
    sw, sh, bpp, ct, pixels = read_png(src)
    print(f'size   : {sw}x{sh}')

    scale = min(TW / sw, TH / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    scaled = resize(pixels, sw, sh, bpp, nw, nh)

    bg = list(BG_COLOR) + ([0xff] if bpp == 4 else [])
    ox, oy = (TW - nw) // 2, (TH - nh) // 2
    canvas = []
    for y in range(TH):
        sy = y - oy
        if sy < 0 or sy >= nh:
            canvas.append(bg * TW)
        else:
            canvas.append(bg * ox + scaled[sy] + bg * (TW - nw - ox))

    write_png(OUTPUT, TW, TH, bpp, ct, canvas)
    print(f'saved  : assets/screenshot_store.png ({TW}x{TH})')


if __name__ == '__main__':
    main()
