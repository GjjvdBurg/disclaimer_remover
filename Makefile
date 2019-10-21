VERSION=$(shell cat manifest.json | grep '"version":' | tr -d '", ' | cut -d':' -f2)

dist_EXTRA :=   ./manifest.json \
		./chrome.manifest \
		./chrome/content/disclaimer_remover.png \
		./chrome/content/messenger-overlay.xul \
		./chrome/content/messenger-overlay.js \
		./chrome/content/compose-overlay.xul \
		./chrome/content/compose-overlay.js \
		./chrome/content/disclaimer_remover.js

.PHONY: all clean

all: disclaimer_remover-$(VERSION).xpi

disclaimer_remover-$(VERSION).xpi: $(dist_EXTRA)
	zip -r disclaimer_remover-$(VERSION).xpi $^

clean:
	rm -f ./disclaimer_remover-*.xpi
