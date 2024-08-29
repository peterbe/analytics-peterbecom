# https://github.com/casey/just
# https://just.systems/

dev:
    npm run dev

build:
    npm run build

start: build
    npm run preview -- --port 3000

pretty:
    npm run pretty

tsc:
    npm run tsc

lint: pretty
    npm run lint
    npm run tsc

lintfix:
    npm run lint:fix

prettyfix:
    npm run pretty:fix

test:
    npm run test

format: prettyfix lintfix

install:
    npm install
