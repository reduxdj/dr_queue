"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
exports.Logger = exports.dbs = exports.upTime = void 0;

var _config = _interopRequireDefault(require("config"));

var _logger = _interopRequireDefault(require("./logger"));

var _redis = _interopRequireDefault(require("./redis"));

var _koa = _interopRequireDefault(require("koa"));

var _process = _interopRequireDefault(require("process"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _routes = _interopRequireDefault(require("./routes"));

var _koaWebsocket = _interopRequireDefault(require("koa-websocket"));

var _moment = _interopRequireDefault(require("moment"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const upTime = (0, _moment.default)().format('MMMM Do YYYY, h:mm:ss a');
exports.upTime = upTime;
const router = new _koaRouter.default();

const _config$get = _config.default.get('db'),
      redis = _config$get.redis;

const _config$get2 = _config.default.get('env'),
      appName = _config$get2.appName,
      timezone = _config$get2.timezone,
      hostIp = _config$get2.hostIp;

const _config$get3 = _config.default.get('webserver'),
      hostname = _config$get3.hostname,
      port = _config$get3.port,
      protocol = _config$get3.protocol,
      useWebsockets = _config$get3.useWebsockets;

const dbs = {// holds a reference to all our clients in a map
  // client, subscriber, publisher
};
exports.dbs = dbs;

function start() {
  return _start.apply(this, arguments);
}

function _start() {
  _start = _asyncToGenerator(function* () {
    return Promise.all(redis.map(
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (config) {
        return yield (0, _redis.default)(config);
      });

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }())).then(results => {
      results.map((_ref3) => {
        let redisClient = _ref3.redisClient,
            name = _ref3.name;
        dbs[name] = redisClient;
        Logger.log('Connection Established');
      });
    });
  });
  return _start.apply(this, arguments);
}

class Logger {
  static log(message, metadata) {
    _logger.default.log({
      env: _process.default.NODE_ENV || 'dev',
      hostIp: _process.default.env.HOST_IP || hostIp,
      hostname: _process.default.env.HOSTNAME || hostname,
      appName: appName,
      timezone: timezone,
      level: 'info',
      message: message,
      metadata: metadata
    });
  }

  static error(message, metadata) {
    _logger.default.log({
      env: _process.default.NODE_ENV || 'dev',
      hostIp: _process.default.env.HOST_IP || hostIp,
      hostname: _process.default.env.HOSTNAME || hostname,
      appName: appName,
      timezone: timezone,
      level: 'info',
      message: message,
      metadata: metadata
    });
  }

}

exports.Logger = Logger;
Logger.log("App Started \u23F0", {
  result: 1
});
const app = (useWebsockets ? (0, _koaWebsocket.default)(new _koa.default()) : new _koa.default()).use(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    Logger.log("".concat(ctx.method, " ").concat(ctx.path), {
      path: ctx.request.path,
      requestIp: ctx.request.ip,
      method: ctx.method,
      params: ctx.params
    });
    return next();
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()).use((0, _koaBodyparser.default)()).use(router.allowedMethods());
(0, _routes.default)(app);
app.listen(port, () => Logger.log("\u2705 The server is running at ".concat(protocol, "://").concat(hostIp, ":").concat(port, "/")));
start();