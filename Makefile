.PHONY:
	test run

default: test

.DEFAULT_GOAL: test

test: 
	@echo "Test is not yet implemented"

nrun:
	./node_modules/.bin/nodemon server.js

rrun:
	./node_modules/.bin/parcel app.js

clean:
	rm -rf dist .cache build

rdist: clean
	./node_modules/.bin/parcel build app.js
