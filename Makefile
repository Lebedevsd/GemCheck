.PHONY: pack fetch update clean

pack:
	python3 pack.py

fetch:
	python3 scrape_gem_colors.py

update:
	python3 update_gems.py

clean:
	rm -f gemcheck.zip
