TESTS = test/*.js
REPORTER = spec
LINT=/node_modules/.bin/jshint
MOCHA=/node_modules/mocha/bin/mocha

all: superagent.js

test:
		@NODE_ENV=test $(MOCHA) \
				--require should \
				--reporter $(REPORTER) \
				--timeout 5000 \
				--growl \
				$(TESTS)

test-cov: lib-cov
		SUPERAGENT_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
		jscoverage lib lib-cov

superagent.js: components
		@component build \
		 --standalone superagent \
		 --out . --name superagent

components:
		component install

test-server:
		@node test/server

docs: test-docs

test-docs:
		make test REPORTER=doc \
				| cat docs/head.html - docs/tail.html \
				> docs/test.html

lint:
		$(LINT) ./

clean:
		rm -fr superagent.js components

.PHONY: test-cov test docs test-docs clean
