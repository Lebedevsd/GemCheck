#!/usr/bin/env python3
"""
Scrape poewiki List of skill gems page and output JSON of gem names by color.
The page has 4 item-tables in order: Strength (r), Dexterity (g), Intelligence (b), None (skip).
"""

import json
import re
import sys
import urllib.request


def fetch_page(url):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; gemcheck-scraper/1.0)"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def extract_gems_from_table(table_html):
    """Extract gem names from a skill gem table's HTML."""
    gems = []

    # Find all rows
    rows = re.split(r'<tr[^>]*>', table_html)[1:]  # skip header row

    for row in rows:
        # Get the first <td> cell
        td_match = re.search(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
        if not td_match:
            continue
        first_td = td_match.group(1)

        # Find the gem name link — it's the main link inside the hoverbox activator
        # Pattern: <a href="/wiki/GemName" title="GemName">GemName</a>
        links = re.findall(
            r'<a href="/wiki/([^"#]+)" title="([^"]+)">([^<]+)</a>',
            first_td,
        )

        for href, title, text in links:
            # Skip image file links and disambiguation
            if href.startswith("File:") or href.startswith("Special:"):
                continue
            # The gem name = the link text (which matches the title)
            name = text.strip()
            if name and name == title.strip() and name not in gems:
                gems.append(name)
                break  # Only take the first valid gem name per row

    return gems


def main():
    url = "https://www.poewiki.net/wiki/List_of_skill_gems"
    print(f"Fetching {url} ...", file=sys.stderr, flush=True)
    html = fetch_page(url)

    # Find all item-tables — they appear in order: Strength, Dexterity, Intelligence, None
    table_positions = [
        m.start() for m in re.finditer(
            r'<table class="wikitable sortable item-table">', html
        )
    ]
    print(f"Found {len(table_positions)} item-tables", file=sys.stderr)

    color_order = ["r", "g", "b"]  # Table 3 (None) is ignored
    result = {"r": [], "g": [], "b": []}

    for i, color in enumerate(color_order):
        if i >= len(table_positions):
            print(f"Warning: missing table for color {color}", file=sys.stderr)
            continue

        start = table_positions[i]
        end = table_positions[i + 1] if i + 1 < len(table_positions) else len(html)
        table_html = html[start:end]

        gems = extract_gems_from_table(table_html)
        result[color] = sorted(gems)
        print(f"Table {i} ({color}): {len(gems)} gems", file=sys.stderr)

    print(json.dumps(result, indent=2))

    total = sum(len(v) for v in result.values())
    print(f"\nTotal: {total} gems", file=sys.stderr)


if __name__ == "__main__":
    main()
