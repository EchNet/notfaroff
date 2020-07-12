.PHONY:
	test run

default: test

.DEFAULT_GOAL: test

test: 
	@echo "Test is not yet implemented"

nrun:
	./node_modules/.bin/nodemon server/index.js

rrun:
	./node_modules/.bin/parcel client/index.js

clean:
	rm -rf dist .cache build

rdist: clean
	./node_modules/.bin/parcel build client/index.js
