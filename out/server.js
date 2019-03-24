"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
exports.log = void 0;

var _config = _interopRequireDefault(require("config"));

var _logger = _interopRequireDefault(require("./logger"));

var _redis = _interopRequireDefault(require("./redis"));

var _koa = _interopRequireDefault(require("koa"));

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const _config$get = _config.default.get('db'),
      redis = _config$get.redis;

const _config$get2 = _config.default.get('env'),
      appName = _config$get2.appName;

function start() {
  return _start.apply(this, arguments);
}

function _start() {
  _start = _asyncToGenerator(function* () {
    Promise.all((yield (0, _redis.default)(redis)));
  });
  return _start.apply(this, arguments);
}

const log = (message, metadata) => _logger.default.log({
  env: _process.default.NODE_ENV || 'dev',
  hostIp: _process.default.env.HOST_IP || '127.0.0.1',
  hostname: _process.default.env.HOSTNAME || 'localhost',
  appName: appName,
  level: 'info',
  message: message,
  metadata: metadata
});

exports.log = log;
log("App Started \u23F0", {
  result: 1
});
const app = new _koa.default().use(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    ctx.dbs = {
      redis: redis
    };
    return next();
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.listen(8000, () => log("\u2705 The server is running at http://localhost:".concat(800, "/")));
start();