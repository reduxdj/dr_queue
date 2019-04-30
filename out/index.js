"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;

var _server = require("./server");

var _process = require("process");

var _logger = require("./logger");

var _middleware = require("./middleware");

const isServer = _process.argv.find(item => item.includes('--server'));

if (isServer) (0, _server.start)().then(_server.startServer);
const Logger = {
  init: (config, redisConnections) => (0, _logger.getLogger)(config, redisConnections),
  setRedisConnections: (_ref) => {
    let client = _ref.client,
        publisher = _ref.publisher;
    return (0, _logger.setRedisConnections)({
      client: client,
      publisher: publisher
    });
  },
  middleware: _middleware.loggerMiddleware
};
exports.Logger = Logger;