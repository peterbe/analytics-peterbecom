# https://github.com/casey/just
# https://just.systems/

dev:
    npm run dev

build:
    npm run build

start: build
    npm run start

pretty:
    prettier --check app *.js

tsc:
    npm run tsc

lint: pretty
    npm run lint
    npm run tsc

lintfix:
    npm run lintfix

prettyfix:
    npm run prettyfix

test:
    npm run test

format: prettyfix lintfix

install:
    npm install
