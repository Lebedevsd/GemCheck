.PHONY: pack fetch update release clean version

# Build distributable zip
pack:
	python3 pack.py

# Scrape latest gem data from poewiki
fetch:
	python3 scrape_gem_colors.py

# Rewrite static gem arrays in content.js from fetched JSONs
update:
	python3 update_gems.py

# Full release workflow: fetch → update → pack
release: fetch update pack

# Print current extension version from manifest
version:
	python3 -c "import json; print(json.load(open('manifest.json'))['version'])"

clean:
	rm -f gemcheck.zip
