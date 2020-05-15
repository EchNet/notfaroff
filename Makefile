.PHONY:
	test run

default: test

.DEFAULT_GOAL: test

test: 
	@echo "Test is not yet implemented"

run:
	./node_modules/.bin/parcel index.html
