#!/usr/bin/env python3
"""Pack the GemCheck extension into a distributable zip."""
import zipfile
import os
import sys

FILES = ['manifest.json', 'content.js', 'icon16.png', 'icon48.png', 'icon128.png']
OUTPUT = 'gemcheck.zip'

def main():
    missing = [f for f in FILES if not os.path.exists(f)]
    if missing:
        print(f'ERROR: missing files: {", ".join(missing)}', file=sys.stderr)
        sys.exit(1)

    with zipfile.ZipFile(OUTPUT, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in FILES:
            z.write(f)
            print(f'  added: {f}')

    size = os.path.getsize(OUTPUT)
    print(f'done: {OUTPUT} ({size // 1024}K)')

if __name__ == '__main__':
    main()
