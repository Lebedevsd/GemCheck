#!/usr/bin/env python3
"""Daily API health check for GemCheck.
Hits every poe.ninja endpoint the extension uses and asserts non-empty lines.
Writes a 'details' output for GitHub Actions / Telegram notification on failure.
"""
import os, sys, json, urllib.request

LEAGUE = os.environ.get('LEAGUE', 'Mirage')

STASH    = 'https://poe.ninja/poe1/api/economy/stash/current/item/overview'
EXCHANGE = 'https://poe.ninja/poe1/api/economy/exchange/current/overview'

ENDPOINTS = [
    # Stash API — item types
    (STASH,    {'league': LEAGUE, 'type': 'SkillGem'}),
    (STASH,    {'league': LEAGUE, 'type': 'UniqueWeapon'}),
    (STASH,    {'league': LEAGUE, 'type': 'UniqueArmour'}),
    (STASH,    {'league': LEAGUE, 'type': 'UniqueJewel'}),
    (STASH,    {'league': LEAGUE, 'type': 'UniqueAccessory'}),
    (STASH,    {'league': LEAGUE, 'type': 'UniqueFlask'}),
    (STASH,    {'league': LEAGUE, 'type': 'UniqueMap'}),
    (STASH,    {'league': LEAGUE, 'type': 'Invitation'}),
    (STASH,    {'league': LEAGUE, 'type': 'Fossil'}),
    # Exchange API — bulk-trade types
    (EXCHANGE, {'league': LEAGUE, 'type': 'Currency'}),
    (EXCHANGE, {'league': LEAGUE, 'type': 'Fragment'}),
    (EXCHANGE, {'league': LEAGUE, 'type': 'Essence'}),
    (EXCHANGE, {'league': LEAGUE, 'type': 'DeliriumOrb'}),
    (EXCHANGE, {'league': LEAGUE, 'type': 'Astrolabe'}),
]

failures = []

for base, params in ENDPOINTS:
    qs  = '&'.join(f'{k}={v}' for k, v in params.items())
    url = f'{base}?{qs}'
    label = params['type']
    try:
        req  = urllib.request.Request(url, headers={'User-Agent': 'GemCheck-healthcheck/1.0'})
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read())
        count = len(data.get('lines', []))
        if count == 0:
            failures.append(f'EMPTY   {label} ({base.split("/")[-1]})')
            print(f'FAIL  {label}: 0 lines')
        else:
            print(f'OK    {label}: {count} lines')
    except Exception as e:
        failures.append(f'ERROR   {label}: {e}')
        print(f'ERROR {label}: {e}')

# Write GitHub Actions output
gha_output = os.environ.get('GITHUB_OUTPUT', '')
if gha_output:
    details = '\n'.join(failures) if failures else 'All endpoints OK.'
    with open(gha_output, 'a') as f:
        f.write(f'details<<GHADELIM\n{details}\nGHADELIM\n')

if failures:
    print(f'\n{len(failures)} endpoint(s) failed.')
    sys.exit(1)

print('\nAll endpoints healthy.')
