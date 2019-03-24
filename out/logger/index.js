"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.logger = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COLORS = {
  gray: 'gray',
  redBright: 'redBright',
  greenBright: 'greenBright',
  yellowBright: 'yellowBright',
  blueBright: 'blueBright',
  magentaBright: 'magentaBright',
  whiteBright: 'whiteBright'
};

let alignColorsAndTime = _winston.default.format.combine(_winston.default.format.colorize({
  all: true
}), _winston.default.format.label({
  label: 'console-logger'
}),
/*eslint-disable */
_winston.default.format.printf(function (_ref) {
  let metadata = _ref.metadata,
      env = _ref.env,
      label = _ref.label,
      level = _ref.level,
      hostIp = _ref.hostIp,
      hostname = _ref.hostname,
      appName = _ref.appName,
      timestamp = _ref.timestamp,
      message = _ref.message;

  for (var _len = arguments.length, info = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    info[_key - 1] = arguments[_key];
  }

  return " ".concat(env, ":").concat(_chalk.default[COLORS.gray](hostname), ":").concat(appName, ":").concat(hostIp, ":").concat(level, " GMT: ").concat(_chalk.default[COLORS.magentaBright]((0, _momentTimezone.default)(timestamp)), " US/PDX: ").concat(_chalk.default[COLORS.yellowBright]((0, _momentTimezone.default)(info.timestamp).tz('America/Los_Angeles').format('hh:mm a')), " ").concat(_chalk.default[COLORS.whiteBright](message), " ").concat(JSON.stringify(_objectSpread({
    env: env,
    hostIp: hostIp,
    appName: appName,
    timestamp: timestamp,
    env: env
  }, metadata)));
})
/*eslint-enable */
);

const logger = _winston.default.createLogger({
  level: "debug",
  transports: [new _winston.default.transports.File({
    filename: 'error.log',
    level: 'error'
  }), new _winston.default.transports.File({
    filename: 'combined.log'
  }), new _winston.default.transports.Console({
    format: _winston.default.format.combine(_winston.default.format.colorize(), alignColorsAndTime)
  })]
});

exports.logger = logger;
var _default = logger;
exports.default = _default;