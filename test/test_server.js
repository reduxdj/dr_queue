const {start, startServer} = require('./server')
const app = start().then(startServer)
module.exports = app
