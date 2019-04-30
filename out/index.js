"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Redis = exports.Logger = void 0;

var _server = require("./server");

var _process = require("process");

var _logger = require("./logger");

var _middleware = require("./middleware");

var _db = require("./redis/db");

var _redis = require("./redis");

var _subscriber = _interopRequireDefault(require("./redis/subscriber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

const Redis = _objectSpread({}, {
  Dbs: _db.Dbs
}, {
  listen: _subscriber.default,
  createRedisConnection: _redis.createRedisConnection
});

exports.Redis = Redis;