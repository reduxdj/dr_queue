"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Koa = exports.Redis = exports.Logger = void 0;

var _server = require("./server");

var _process = require("process");

var _logger = require("./logger");

var _middleware = require("./middleware");

var _redis = require("./redis");

var _db = require("./redis/db");

var _subscriber = _interopRequireDefault(require("./redis/subscriber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isServer = _process.argv.find(item => item.includes('--server'));

if (isServer) (0, _server.start)().then(_server.startServer);
const Logger = {
  init: function init(config, redisConnections) {
    for (var _len = arguments.length, formatters = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      formatters[_key - 2] = arguments[_key];
    }

    return (0, _logger.getLogger)(config, redisConnections, ...formatters);
  },
  setRedisConnections: (_ref) => {
    let client = _ref.client,
        publisher = _ref.publisher;
    return (0, _logger.setRedisConnections)({
      client: client,
      publisher: publisher
    });
  },
  middleware: _middleware.loggerMiddleware,
  colorFormatter: _logger.colorFormatter,
  labelFormatter: _logger.labelFormatter,
  printFormatter: _logger.printFormatter
};
exports.Logger = Logger;
const Redis = {
  dbs: _db.dbs,
  redisRetryStrategy: _redis.redisRetryStrategy,
  listen: _subscriber.default,
  createRedisConnection: _redis.createRedisConnection,
  length: _db.length,
  clearDelay: _db.clearDelay,
  push: _db.push,
  pop: _db.pop,
  popLeft: _db.popLeft,
  popRight: _db.popRight,
  pushRight: _db.pushRight,
  pushLeft: _db.pushLeft,
  hasNext: _db.hasNext,
  range: _db.range,
  reset: _db.reset,
  delay: _db.delay,
  pause: _db.pause,
  sRange: _db.sRange,
  firstOne: _db.firstOne,
  lastOne: _db.lastOne,
  setPublisher: _db.setPublisher,
  setClient: _db.setClient,
  setSubscriber: _db.setSubscriber
};
exports.Redis = Redis;
const Koa = {
  startServer: _server.startServer,
  start: _server.start
};
exports.Koa = Koa;