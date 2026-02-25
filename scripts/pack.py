#!/usr/bin/env python3
"""Pack the GemCheck extension into a distributable zip."""
import zipfile
import os
import sys

# Paths are relative to the project root (one level up from scripts/)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FILES = [
    'manifest.json',
    'src/background.js',
    'src/content.js',
    'assets/icon16.png',
    'assets/icon48.png',
    'assets/icon128.png',
]
OUTPUT = os.path.join(ROOT, 'gemcheck.zip')


def main():
    os.chdir(ROOT)
    missing = [f for f in FILES if not os.path.exists(f)]
    if missing:
        print(f'ERROR: missing files: {", ".join(missing)}', file=sys.stderr)
        sys.exit(1)

    with zipfile.ZipFile(OUTPUT, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in FILES:
            z.write(f)
            print(f'  added: {f}')

    size = os.path.getsize(OUTPUT)
    print(f'done: gemcheck.zip ({size // 1024}K)')


if __name__ == '__main__':
    main()
