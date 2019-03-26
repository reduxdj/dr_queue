"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _Logger = _interopRequireDefault(require("../Logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const redisRetryStrategy = (_ref) => {
  let attempt = _ref.attempt;

  if (attempt < 8) {
    const nextDelay = Math.min(attempt * 500, 3000);

    _Logger.default.log("Reattempting Redis connection after ".concat(nextDelay, "ms"));

    return nextDelay;
  }

  return undefined;
};

let redisClient;

const createRedisConnection =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (_ref2) {
    let host = _ref2.host,
        port = _ref2.port,
        name = _ref2.name;
    return new Promise((resolve, reject) => {
      _Logger.default.log("Attempting to connect ".concat(name, " to //").concat(host, ":").concat(port)); //eslint-disable-line


      redisClient = _redis.default.createClient({
        url: "//".concat(host, ":").concat(port),
        retry_strategy: redisRetryStrategy
      }).on('connect', info => {
        _Logger.default.log("//".concat(host, ":").concat(port, " Redis Connected")); //eslint-disable-line


        resolve({
          name: name,
          redisClient: redisClient
        });
      }).on('error', err => {
        _Logger.default.log('Redis disconnected'); //eslint-disable-line


        reject(err);
      });
    });
  });

  return function createRedisConnection(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = createRedisConnection;
exports.default = _default;