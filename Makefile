clean-css = ./node_modules/.bin/cleancss
duo = ./node_modules/.bin/duo
myth = ./node_modules/.bin/myth
uglify = ./node_modules/.bin/uglifyjs

#
# Default task
#

default: build

#
# Tasks
#

clean:
	@rm -rf build

app: node_modules
	@$(MAKE) clean
	@$(MAKE) build
	@atom .

#
# Targets
#

build: node_modules index.html
	@mkdir -p build
	@$(MAKE) build/index.js
	@$(MAKE) build/index.css

build/index.js: node_modules index.js
	@$(duo) index.js | $(uglify) > build/index.js

build/index.css: node_modules index.css
	@$(duo) index.css | $(myth) | $(clean-css) > build/index.css

node_modules: package.json
	@npm install
	@touch node_modules

#
# Phony targets
#

.PHONY: app
.PHONY: clean
