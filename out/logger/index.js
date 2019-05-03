"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogger = exports.default = exports.Logger = exports.printFormatter = exports.labelFormatter = exports.colorFormatter = exports.COLORS = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _chalk = _interopRequireDefault(require("chalk"));

var _db = require("../redis/db");

var _stripAnsi = _interopRequireDefault(require("strip-ansi"));

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
exports.COLORS = COLORS;

const colorFormatter = _winston.default.format.colorize({
  all: true
});

exports.colorFormatter = colorFormatter;

const labelFormatter = _winston.default.format.label({
  label: 'console-logger'
});
/*eslint-disable */


exports.labelFormatter = labelFormatter;

const printFormatter = _winston.default.format.printf(function (_ref) {
  let _ref$metadata = _ref.metadata,
      metadata = _ref$metadata === void 0 ? {} : _ref$metadata,
      _ref$env = _ref.env,
      env = _ref$env === void 0 ? {} : _ref$env,
      label = _ref.label,
      level = _ref.level,
      hostIp = _ref.hostIp,
      hostname = _ref.hostname,
      appName = _ref.appName,
      timestamp = _ref.timestamp,
      message = _ref.message,
      timezone = _ref.timezone;

  for (var _len = arguments.length, info = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    info[_key - 1] = arguments[_key];
  }

  return " ".concat(env, ":").concat(_chalk.default[COLORS.gray](hostname), ":").concat(appName, ":").concat(hostIp, ":").concat(level, " UTC: ").concat(_chalk.default[COLORS.magentaBright]((0, _momentTimezone.default)(timestamp)), " ").concat(timezone, ": ").concat(_chalk.default[COLORS.yellowBright]((0, _momentTimezone.default)(info.timestamp).tz(timezone).format('hh:mm a')), " ").concat(_chalk.default[COLORS.whiteBright](message), " ").concat(_chalk.default[COLORS.gray](JSON.stringify(_objectSpread({
    env: env,
    hostIp: hostIp,
    appName: appName,
    timestamp: timestamp
  }, info, metadata && typeof metadata === 'object' ? metadata : {
    metadata: metadata
  }))));
});
/*eslint-enable */


exports.printFormatter = printFormatter;

const alignColorsAndTime = _winston.default.format.combine(colorFormatter, labelFormatter, printFormatter);

function createTransport(_ref2) {
  let filename = _ref2.filename,
      level = _ref2.level;
  return new _winston.default.transports.File({
    filename: filename,
    level: level
  });
}

function createLogger() {
  let transports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  for (var _len2 = arguments.length, formatters = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    formatters[_key2 - 1] = arguments[_key2];
  }

  return _winston.default.createLogger({
    level: "info",
    transports: (transports ? transports.map(createTransport) : [new _winston.default.transports.File({
      filename: 'error.log',
      level: 'error'
    }), new _winston.default.transports.File({
      filename: 'info.log',
      level: 'info'
    })]).concat(new _winston.default.transports.Console({
      format: formatters.length > 0 ? _winston.default.format.combine(...formatters) : _winston.default.format.combine(alignColorsAndTime)
    }))
  });
}

let logger;

class Logger {
  constructor(_ref3) {
    let env = _ref3.env,
        appName = _ref3.appName,
        timezone = _ref3.timezone,
        hostIp = _ref3.hostIp,
        hostname = _ref3.hostname,
        _ref3$omitFields = _ref3.omitFields,
        omitFields = _ref3$omitFields === void 0 ? [] : _ref3$omitFields,
        _ref3$errorIgnoreLeve = _ref3.errorIgnoreLevels,
        errorIgnoreLevels = _ref3$errorIgnoreLeve === void 0 ? [] : _ref3$errorIgnoreLeve,
        transports = _ref3.transports;
    let redisConnections = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len3 = arguments.length, formatters = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      formatters[_key3 - 2] = arguments[_key3];
    }

    logger = createLogger(transports, ...formatters);
    this.env = env || 'dev';
    this.appName = appName;
    this.timezone = timezone;
    this.hostIp = process.env.HOST_IP || hostIp;
    this.hostname = process.env.HOSTNAME || hostname;
    this.errorIgnoreLevels = errorIgnoreLevels;
    this.omitFields = omitFields;
    const publisher = redisConnections.publisher,
          client = redisConnections.client;

    if (publisher) {
      _db.dbs[publisher] = publisher;
      this.publisher = publisher;
    }

    if (client) {
      _db.dbs[client] = client;
      this.client = client;
    }
  }

  static getLogger() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let redisConnections = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len4 = arguments.length, formatters = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
      formatters[_key4 - 2] = arguments[_key4];
    }

    return new Logger(config, redisConnections, ...formatters);
  }

  getInoreLevels() {
    return this.errorIgnoreLevels;
  }

  getOmitFields() {
    return this.omitFields;
  }

  logSilent() {
    let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const payload = {
      env: this.env,
      hostIp: this.hostIp,
      hostname: this.hostname,
      appName: this.appName,
      timezone: this.timezone,
      level: 'info',
      message: message,
      metadata: metadata
    };
    logger.log(payload);
  }

  log() {
    let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const payload = {
      env: this.env,
      hostIp: this.hostIp,
      hostname: this.hostname,
      appName: this.appName,
      timezone: this.timezone,
      level: 'info',
      message: message,
      metadata: metadata
    };
    logger.log(payload);
    if (this.publisher) (0, _db.publish)("".concat(this.env, ":").concat(this.appName), _objectSpread({}, payload, {
      message: (0, _stripAnsi.default)(message)
    }));
    if (this.client) (0, _db.push)("".concat(this.env, ":").concat(this.appName), _objectSpread({}, payload, {
      message: (0, _stripAnsi.default)(message)
    }));
  }

  info() {
    let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.log(message, metadata);
  }

  error() {
    let message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const payload = {
      env: this.env,
      hostIp: this.hostIp,
      hostname: this.hostname,
      appName: this.appName,
      timezone: this.timezone,
      level: 'error',
      message: message,
      metadata: metadata
    };
    logger.error(payload);
    if (this.publisher) (0, _db.publish)("".concat(this.env, ":").concat(this.appName), _objectSpread({}, payload, {
      message: (0, _stripAnsi.default)(message)
    }));
    if (this.client) (0, _db.push)("".concat(this.env, ":").concat(this.appName), _objectSpread({}, payload, {
      message: (0, _stripAnsi.default)(message)
    }));
  }

  setRedisConnections(_ref4) {
    let client = _ref4.client,
        publisher = _ref4.publisher;

    if (publisher) {
      (0, _db.setPublisher)(publisher);
      this.publisher = publisher;
    }

    if (client) {
      (0, _db.setClient)(client);
      this.client = client;
    }
  }

}

exports.Logger = Logger;
var _default = Logger;
exports.default = _default;

const getLogger = function getLogger(config, redisConnections) {
  for (var _len5 = arguments.length, formatters = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    formatters[_key5 - 2] = arguments[_key5];
  }

  return new Logger(config, redisConnections, ...formatters);
};

exports.getLogger = getLogger;