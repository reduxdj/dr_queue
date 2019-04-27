

# Used in package.json to execute a single webpack build
#   - passes the first argument to the mocha grep option
NODE_ENV=test && npm run build && ./node_modules/.bin/mocha test/*.js --fgrep="$1"
