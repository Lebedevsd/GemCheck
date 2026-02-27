#!/usr/bin/env python3
"""Pack the GemCheck extension into a Firefox-compatible zip.

Same as pack.py but injects browser_specific_settings into the manifest
so Firefox assigns a stable add-on ID across installs.
The main manifest.json is not modified on disk.
"""
import json
import zipfile
import os
import sys
import io

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FILES = [
    'src/background.js',
    'src/content.js',
    'assets/icon16.png',
    'assets/icon48.png',
    'assets/icon128.png',
]
OUTPUT = os.path.join(ROOT, 'gemcheck_firefox.zip')


def main():
    os.chdir(ROOT)
    missing = [f for f in FILES if not os.path.exists(f)]
    if missing:
        print(f'ERROR: missing files: {", ".join(missing)}', file=sys.stderr)
        sys.exit(1)

    # Patch manifest in memory
    with open('manifest.json') as f:
        manifest = json.load(f)

    manifest['browser_specific_settings'] = {
        'gecko': {
            'id': 'gemcheck@lebedevsd',
            'strict_min_version': '140.0',
            'data_collection_permissions': {
                'required': ['none'],
                'optional': [],
            },
        },
        'gecko_android': {
            'strict_min_version': '142.0',
        },
    }

    # Firefox doesn't support background.service_worker yet;
    # replace it with background.scripts (event page approach)
    if 'service_worker' in manifest.get('background', {}):
        manifest['background'] = {
            'scripts': [manifest['background']['service_worker']]
        }
    manifest_bytes = json.dumps(manifest, indent=2).encode()

    with zipfile.ZipFile(OUTPUT, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('manifest.json', manifest_bytes)
        print('  added: manifest.json (patched for Firefox)')
        for f in FILES:
            z.write(f)
            print(f'  added: {f}')

    size = os.path.getsize(OUTPUT)
    print(f'done: gemcheck_firefox.zip ({size // 1024}K)')


if __name__ == '__main__':
    main()
