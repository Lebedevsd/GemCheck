# Changelog

## [1.1.3] – 2026-03-19

### Added
- **Astrolabes tab** — Harvest swap EV for Astrolabes (400 Primal Lifeforce per swap)
- **Forbidden Jewels tab** — average price of Forbidden Flame and Forbidden Flesh variants in divines; shows two rows: all variants and excluding 7 hidden ascendancy passives; columns: avg · σ · min · max

## [1.1.2] – 2026-03-13

### Fixed
- Manifest description trimmed to fit Chrome Web Store 132-character limit
- Store description updated to cover Harvest swap, gem filter, and GCP features
- GitHub Actions workflow pinned to Node.js 24-compatible action versions

## [1.1.1] – 2026-03-13

### Added
- **Harvest swap tabs** — Catalysts, Essences, and Delirium Orbs tabs with pool EV, craft threshold, and ▲ keep / ▼ craft indicators per item
- **Weighted EV** — Catalyst and Delirium Orb probabilities use baked-in observed drop rates from ~2000 swaps by lifewithoutpants_ (YouTube) instead of uniform distribution
- **Gem level/quality filter** — switch between lvl 1 q 0%, lvl 1 q 20%, lvl 20 q 0%, and lvl 20 q 20% for all gem pricing
- **EV methodology note** — shown in the status bar on Catalysts and Deli Orbs tabs with data credit

### Changed
- Transfigured gem pool updated for the new league: 197 total (35r / 75g / 87b), up from 166
- Header buttons and league badge unified to consistent 24px height
- Arrows (▲/▼) moved to fixed-width column so prices don't shift

### Fixed
- Minimize → restore now correctly hides gem controls when on a harvest tab
- Gem q 0% filter now matches API entries where `gemQuality` is absent (treated as 0)
- Images for Essences and Delirium Orbs now load via itemoverview CDN URLs
- Lifeforce prices below 0.1c now show two decimal places instead of rounding to 0.0c
- Essences now fetch from the exchange API matching other harvest tabs

---

## [1.0.4] – 2026-03-03

### Fixed
- **Trathan gems excluded** — gems with "of Trarthus" suffix (a separate Divine Font mechanic) are now filtered out from both the color roll pool and specific gems section; scraper also guards against picking them up from poewiki in future runs

---

## [1.0.3] – 2026-03-03

### Added
- **Collapsible sections** — click any card header to collapse/expand; chevron indicator rotates to show state
- **Resize handle** — drag the bottom-right corner to resize the panel width and height
- **`⚗ lvl 1 · q 0%` badge** — clearly shows that prices reflect raw Divine Font output (level 1, 0% quality gems); hover for explanation tooltip
- **Firefox extension** — `gemcheck_firefox.zip` release artifact with patched manifest (`background.scripts`, `data_collection_permissions`, `gecko_android` min version)
- **GitHub Actions release workflow** — manually triggered, produces both Chrome and Firefox zips as release artifacts

### Fixed
- **Scroll not working** — cards were being shrunk by flex layout and clipped; fixed with `min-height: 0` on scroll body and `flex-shrink: 0` on cards
- **Specific gems EV** — now uses highest variant price instead of average, reflecting the 3.28 mechanic where you can pick the best transfigured variant
- **innerHTML security warnings** — replaced dynamic `innerHTML` assignments with `DOMParser` + `adoptNode` approach (satisfies AMO `no-unsanitized` rule)
- **`tabs` permission removed** — `chrome.tabs.create()` does not require it; removed to satisfy Chrome Web Store review
- **League name normalisation** — HC/SSF suffix variants now correctly map to API names (e.g. `keepershc` → `Hardcore Keepers`)

### Changed
- "Best Specific Gems" section title updated to "by best variant" to reflect calculation change
- README: Chrome install section now lists all supported Chromium browsers (Brave, Opera GX, Vivaldi, Edge)
- Default Top N changed to 8

---

## [1.0.2] – 2026-02-25

### Added
- **Firefox support** — `pack_firefox.py` script patches manifest on-the-fly for Firefox compatibility
- **`make pack-firefox`** Makefile target
- **CORS proxy fallback** — web page version retries via `corsproxy.io` if direct poe.ninja requests are blocked
- **Web page version** — standalone `web/index.html` for use while awaiting store approval

### Fixed
- **Pool size** — now uses static `TRANSFIG_GEMS` length instead of API-derived count, fixing undercounted pools
- **EV formula** — corrected order-statistic formula for best-of-3 draws: `((n-i)/n)^3 - ((n-i-1)/n)^3`

---

## [1.0.1] – 2026-02-20

### Added
- Extension icon from `assets/icon.png`
- Donate button (Buy Me a Coffee) in panel footer with hover glow effect
- Specific Gems section showing all variants with probability and price per variant
- `make release` workflow (`fetch` → `update` → `pack`)
- `scripts/update_gems.py` — rewrites static gem arrays in `content.js` from fetched JSON data
- `scripts/scrape_gem_colors.py` — scrapes base and transfigured gem lists from poewiki
- SPA navigation detection (pushState / replaceState / popstate)
- Fetch interceptor (`injectInterceptor`) as fallback for poe.ninja's own API calls

### Fixed
- Page intercept timing — moved `injectInterceptor()` to top-level (before `DOMContentLoaded`) so it hooks `window.fetch` before poe.ninja's scripts run
- League names with spaces now correctly URL-encoded

---

## [1.0.0] – 2026-02-18

### Initial release
- Floating draggable panel injected into poe.ninja skill-gems pages
- **Color Roll Bingo** — top N gems per colour with hit probability and sell price
- **Best Specific Gems** — cross-colour ranking of base gems by EV, all variants shown
- Live pricing from poe.ninja public API (`/api/data/itemoverview?type=SkillGem`)
- League auto-detected from URL path
- 5-minute in-memory cache with manual Refresh
- Shadow DOM for full CSS isolation
- Top N selector (3 / 5 / 8)
- Static gem data: 273 base gems, 186 transfigured gems (from poewiki)
