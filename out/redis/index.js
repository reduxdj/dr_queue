"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _server = require("../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const createRedisConnection =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (_ref) {
    let host = _ref.host,
        port = _ref.port;
    return new Promise((resolve, reject) => {
      _redis.default.createClient({
        url: "//".concat(host, ":").concat(port)
      }).on('connect', info => {
        (0, _server.log)("//".concat(host, ":").concat(port, " Redis Connected")); //eslint-disable-line
      }).on('error', err => {
        (0, _server.log)('Redis disconnected'); //eslint-disable-line

        reject(err);
      });
    });
  });

  return function createRedisConnection(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = createRedisConnection;
exports.default = _default;