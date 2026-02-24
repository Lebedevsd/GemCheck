#!/usr/bin/env python3
"""
Scrape poewiki skill gem pages and output JSON of gem names by color (r/g/b).

Outputs two files:
  gem_colors.json            — base skill gems
  gem_colors_transfigured.json — transfigured skill gems

Both pages render item-tables in order: Strength (r), Dexterity (g), Intelligence (b).
The base gem page has a 4th table for no-attribute gems (ignored).
"""

import json
import re
import sys
import urllib.request

PAGES = [
    {
        "url": "https://www.poewiki.net/wiki/List_of_skill_gems",
        "out": "gem_colors.json",
        "label": "base gems",
        "n_tables": 3,  # first 3 of 4 (skip None table)
    },
    {
        "url": "https://www.poewiki.net/wiki/Transfigured_skill_gem",
        "out": "gem_colors_transfigured.json",
        "label": "transfigured gems",
        "n_tables": 3,  # all 3 tables are r/g/b
    },
]

COLOR_ORDER = ["r", "g", "b"]


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
    rows = re.split(r'<tr[^>]*>', table_html)[1:]  # skip header row

    for row in rows:
        td_match = re.search(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
        if not td_match:
            continue
        first_td = td_match.group(1)

        links = re.findall(
            r'<a href="/wiki/([^"#]+)" title="([^"]+)">([^<]+)</a>',
            first_td,
        )
        for href, title, text in links:
            if href.startswith("File:") or href.startswith("Special:"):
                continue
            name = text.strip()
            if name and name == title.strip() and name not in gems:
                gems.append(name)
                break

    return gems


def scrape_page(cfg):
    url, out_file, label, n_tables = (
        cfg["url"], cfg["out"], cfg["label"], cfg["n_tables"]
    )
    print(f"\nFetching {label}: {url} ...", file=sys.stderr, flush=True)
    html = fetch_page(url)

    positions = [
        m.start()
        for m in re.finditer(r'<table class="wikitable sortable item-table">', html)
    ]
    print(f"  Found {len(positions)} item-tables", file=sys.stderr)

    result = {"r": [], "g": [], "b": []}

    for i, color in enumerate(COLOR_ORDER[:n_tables]):
        if i >= len(positions):
            print(f"  Warning: missing table for color {color}", file=sys.stderr)
            continue

        start = positions[i]
        close = html.find("</table>", start)
        end = close + len("</table>") if close != -1 else len(html)
        gems = extract_gems_from_table(html[start:end])
        result[color] = sorted(gems)
        print(f"  Table {i} ({color}): {len(gems)} gems", file=sys.stderr)

    total = sum(len(v) for v in result.values())
    print(f"  Total: {total} gems → {out_file}", file=sys.stderr)

    with open(out_file, "w") as f:
        json.dump(result, f, indent=2)
        f.write("\n")

    return result


def main():
    for cfg in PAGES:
        scrape_page(cfg)
    print("\nDone.", file=sys.stderr)


if __name__ == "__main__":
    main()
