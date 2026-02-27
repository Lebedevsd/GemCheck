.PHONY: pack pack-firefox fetch update release screenshot clean version

# Build distributable zip (Chrome)
pack:
	python3 scripts/pack.py

# Build distributable zip (Firefox)
pack-firefox:
	python3 scripts/pack_firefox.py

# Scrape latest gem data from poewiki
fetch:
	python3 scripts/scrape_gem_colors.py

# Rewrite static gem arrays in src/content.js from fetched JSONs
update:
	python3 scripts/update_gems.py

# Full release workflow: fetch → update → pack
release: fetch update pack

# Print current extension version from manifest
version:
	python3 -c "import json; print(json.load(open('manifest.json'))['version'])"

# Generate assets/screenshot_store.png from newest screenshot in project root
# Optional: pass source explicitly with  make screenshot SRC=myfile.png
screenshot:
	python3 scripts/gen_screenshot.py $(SRC)

clean:
	rm -f gemcheck.zip gemcheck_firefox.zip
