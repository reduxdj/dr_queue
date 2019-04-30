"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
exports.startServer = startServer;
exports.app = exports.upTime = exports.logger = void 0;

var _config = _interopRequireDefault(require("config"));

var _logger = require("../logger");

var _redis = _interopRequireDefault(require("../redis"));

var _koa = _interopRequireDefault(require("koa"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _routes = _interopRequireDefault(require("../routes"));

var _koaWebsocket = _interopRequireDefault(require("koa-websocket"));

var _moment = _interopRequireDefault(require("moment"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _middleware = require("../middleware");

var _db = require("../redis/db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const configEnv = _config.default && _config.default.has('env') && _config.default.get('env') || {};
const logger = (0, _logger.getLogger)(configEnv);
exports.logger = logger;
const upTime = (0, _moment.default)().format('MMMM Do YYYY, h:mm:ss a');
exports.upTime = upTime;
const router = new _koaRouter.default();

const _ref = _config.default && _config.default.has('db') && _config.default.get('db') || [],
      redis = _ref.redis;

const _ref2 = _config.default && _config.default.has('webserver') && _config.default.get('webserver') || {},
      port = _ref2.port,
      protocol = _ref2.protocol,
      useWebsockets = _ref2.useWebsockets,
      hostIp = _ref2.hostIp;

const app = useWebsockets ? (0, _koaWebsocket.default)(new _koa.default()) : new _koa.default();
exports.app = app;

function start() {
  return _start.apply(this, arguments);
}

function _start() {
  _start = _asyncToGenerator(function* () {
    return new Promise(resolve => {
      return Promise.all(redis.map(
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(function* (config) {
          return yield (0, _redis.default)(config);
        });

        return function (_x) {
          return _ref3.apply(this, arguments);
        };
      }())).then(function () {
        let results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        results.map((_ref4) => {
          let redisClient = _ref4.redisClient,
              name = _ref4.name;
          _db.dbs[name] = redisClient;
          logger.log("Connection Established to ".concat(name));
        });
      }).then(resolve);
    });
  });
  return _start.apply(this, arguments);
}

function startServer() {
  logger.log('Starting Server');
  app.use((0, _koaBodyparser.default)()).use((0, _koaBodyparser.default)()).use((0, _middleware.loggerMiddleware)((0, _logger.getLogger)(configEnv, _db.dbs))).use(router.allowedMethods());
  app.listen(port, () => logger.log("\u2705 The server is running at ".concat(protocol, "://").concat(hostIp, ":").concat(port, "/")), {
    meta: 'test'
  });
  (0, _routes.default)(app);
  return app;
}