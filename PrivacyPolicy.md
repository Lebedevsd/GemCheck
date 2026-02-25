# Privacy Policy – GemCheck

**Last updated: 25 February 2026**

## Overview

GemCheck is a free, open-source Chrome extension that helps Path of Exile players
calculate profitable transfigured gems for the Labyrinth Divine Font using live
pricing data from poe.ninja.

## Data Collection

**GemCheck does not collect, store, transmit, or share any personal data.**

There are no user accounts, no analytics, no tracking pixels, and no third-party
services of any kind embedded in this extension.

## What the Extension Does Access

| Data | Purpose | Stored? | Sent anywhere? |
|------|---------|---------|----------------|
| Current page URL | Read the Path of Exile league name from the URL path | No | No |
| poe.ninja public API response | Display gem prices inside the panel | In-memory only, cleared on tab close | No |

The extension only activates on `poe.ninja/*/economy/*/skill-gems*` pages —
the same page the user is already viewing.

## Network Requests

The extension makes one type of outbound request:

- **`poe.ninja/api/data/itemoverview`** — poe.ninja's own public API, called to
  fetch skill gem prices for the current league. This is the same request
  poe.ninja's own page makes. No user-identifying data is included in this request.

No data is sent to any server owned or operated by GemCheck or its author.

## Local Storage

GemCheck does not use `localStorage`, `sessionStorage`, `IndexedDB`, cookies,
or any other persistent storage mechanism. The only state kept is a short-lived
in-memory price cache (5 minutes) that is discarded when the browser tab is closed.

## Permissions

GemCheck uses the `tabs` permission solely to open `https://poe.ninja` in a new
tab when the user clicks the extension icon. No tab data, browsing history, or
any other tab information is read or stored.

## Third Parties

GemCheck does not share any data with third parties. It has no dependencies on
advertising networks, analytics services, or external libraries loaded at runtime.

The panel contains an optional **"Buy me a coffee"** link to
[buymeacoffee.com](https://buymeacoffee.com). Clicking it navigates to that
external site in a new tab. GemCheck does not transmit any data to that site —
it is a plain HTML link. buymeacoffee.com's own privacy policy applies if you
choose to visit it.

## Children's Privacy

GemCheck does not knowingly collect any information from anyone, including minors.

## Changes to This Policy

If this policy ever changes it will be updated in this file with a revised
"Last updated" date. Since the extension collects no data, no material changes
are anticipated.

## Contact

For questions or concerns, open an issue on the GitHub repository.
