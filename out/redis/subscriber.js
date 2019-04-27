"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listen = listen;

var _config = _interopRequireDefault(require("config"));

var _logger = _interopRequireDefault(require("../logger"));

var _redis = _interopRequireDefault(require("../redis"));

var _process = require("process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const _config$get = _config.default.get('db'),
      redis = _config$get.redis;

const index = _process.argv.indexOf('--channel');

const isInScriptMode = _process.argv.find(item => item.includes('subscriber'));

const channel = _process.argv[index + 1];

function listen(_x) {
  return _listen.apply(this, arguments);
}

function _listen() {
  _listen = _asyncToGenerator(function* (channel) {
    return new Promise(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (resolve) {
        const config = redis.find((_ref2) => {
          let name = _ref2.name;
          return name === 'subscriber';
        });

        const _ref3 = yield (0, _redis.default)(config),
              redisClient = _ref3.redisClient;
        /* eslint-disable */


        redisClient.on('message', (channel, message) => _logger.default.log('messageReceived', {
          channel: channel,
          message: message
        }));
        redisClient.subscribe(channel);
      });

      return function (_x2) {
        return _ref.apply(this, arguments);
      };
    }()).then(() => {
      resolve(message);
    });
    /* eslint-enable */
  });
  return _listen.apply(this, arguments);
}

if (isInScriptMode) {
  listen(channel);

  _logger.default.log("Subscriber Started \u23F0 on ".concat(channel));
}