"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
exports.default = exports.app = exports.upTime = void 0;

var _config = _interopRequireDefault(require("config"));

var _logger = _interopRequireWildcard(require("./logger"));

var _redis = _interopRequireDefault(require("./redis"));

var _koa = _interopRequireDefault(require("koa"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _routes = _interopRequireDefault(require("./routes"));

var _koaWebsocket = _interopRequireDefault(require("koa-websocket"));

var _moment = _interopRequireDefault(require("moment"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _middleware = require("./middleware");

var _db = require("./redis/db");

var _process = require("process");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const isRunningSubscriber = _process.argv.find(item => item.includes('subscriber'));

const upTime = (0, _moment.default)().format('MMMM Do YYYY, h:mm:ss a');
exports.upTime = upTime;
const router = new _koaRouter.default();

const _config$get = _config.default.get('db'),
      redis = _config$get.redis;

const _config$get2 = _config.default.get('webserver'),
      port = _config$get2.port,
      protocol = _config$get2.protocol,
      useWebsockets = _config$get2.useWebsockets,
      hostIp = _config$get2.hostIp;

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
        var _ref = _asyncToGenerator(function* (config) {
          return yield (0, _redis.default)(config);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }())).then(results => {
        results.map((_ref2) => {
          let redisClient = _ref2.redisClient,
              name = _ref2.name;
          _db.dbs[name] = redisClient;

          _logger.default.log("Connection Established to ".concat(name));
        });
      }).then(resolve);
    });
  });
  return _start.apply(this, arguments);
}

function startServer() {
  _logger.default.log('Starting Server');

  app.use((0, _koaBodyparser.default)()).use((0, _koaBodyparser.default)()).use((0, _middleware.loggerMiddleware)((0, _logger.getLogger)(_config.default.get('env')))).use(router.allowedMethods());
  app.listen(port, () => _logger.default.log("\u2705 The server is running at ".concat(protocol, "://").concat(hostIp, ":").concat(port, "/")), {
    meta: 'test'
  });
  (0, _routes.default)(app);
  return app;
}

if (!isRunningSubscriber) start().then(startServer);
var _default = app;
exports.default = _default;