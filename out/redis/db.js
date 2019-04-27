"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPublisher = setPublisher;
exports.setSubscriber = setSubscriber;
exports.setClient = setClient;
exports.parseList = parseList;
exports.pop = pop;
exports.push = push;
exports.popLeft = popLeft;
exports.popRight = popRight;
exports.pushLeft = pushLeft;
exports.pushRight = pushRight;
exports.hasNext = hasNext;
exports.range = range;
exports.sRange = sRange;
exports.lastOne = lastOne;
exports.firstOne = firstOne;
exports.length = length;
exports.reset = reset;
exports.last = last;
exports.first = first;
exports.pause = pause;
exports.delay = delay;
exports.clearDelay = clearDelay;
exports.publish = publish;
exports.RIGHT = exports.LEFT = exports.dbs = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _server = require("../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const dbs = {// holds a reference to all our clients in a map
  // client, subscriber, publisher
};
exports.dbs = dbs;

function setPublisher(publisher) {
  dbs[publisher] = publisher;
}

function setSubscriber(subcriber) {
  dbs[subcriber] = subcriber;
}

function setClient(client) {
  dbs[client] = client;
}

const DB_CONSTANTS = {
  LEFT: 0,
  RIGHT: 1
};
const LEFT = 'LEFT';
exports.LEFT = LEFT;
const RIGHT = 'RIGHT';
exports.RIGHT = RIGHT;

function getJsonString(data) {
  if (typeof data === 'object') return JSON.stringify(data);else return data;
}

function parseResult(result) {
  if ((typeof result === 'string' && result).match(/^\{/)) // Pass along strings, maybe something is expecting a string?
    return Promise.resolve(JSON.parse(result));else if (result) return Promise.resolve(result);else return Promise.resolve();
}

function parseList() {
  let item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[]';
  return Promise.resolve(item);
}

function pop(_x) {
  return _pop.apply(this, arguments);
}

function _pop() {
  _pop = _asyncToGenerator(function* (queueName) {
    let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DB_CONSTANTS.RIGHT;
    return new Promise(resolve => {
      dbs.client[direction > 0 ? 'rpop' : 'lpop'](queueName, (err, data) => {
        resolve(parseResult(data));
      });
    }).catch(_server.log);
  });
  return _pop.apply(this, arguments);
}

function push() {
  let queueName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'bad-queue';
  let item = arguments.length > 1 ? arguments[1] : undefined;
  let direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DB_CONSTANTS.LEFT;
  return new Promise(resolve => dbs.client[direction > 0 ? 'rpush' : 'lpush'](queueName, getJsonString(item), (err, data) => resolve(data))).catch(_server.log);
}

function popLeft(queueName) {
  return new Promise(resolve => {
    dbs.client.lpop(queueName, (err, data) => {
      resolve(parseResult(data));
    });
  }).catch(_server.log);
}

function popRight(_x2) {
  return _popRight.apply(this, arguments);
}

function _popRight() {
  _popRight = _asyncToGenerator(function* (queueName) {
    return pop(queueName, DB_CONSTANTS.LEFT); //we transpose this r
  });
  return _popRight.apply(this, arguments);
}

function pushLeft(_x3, _x4) {
  return _pushLeft.apply(this, arguments);
}

function _pushLeft() {
  _pushLeft = _asyncToGenerator(function* (queueName, item) {
    let direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DB_CONSTANTS.LEFT;
    return push(queueName, item, direction);
  });
  return _pushLeft.apply(this, arguments);
}

function pushRight(queueName, item) {
  let direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DB_CONSTANTS.RIGHT;
  return push(queueName, item, direction);
}

function hasNext(queueName) {
  return new Promise(resolve => dbs.client.lrange(queueName, -1, -1, (err, data) => {
    resolve(!!data);
  }));
}

function range(queueName, start, stop) {
  return new Promise(resolve => dbs.client.lrange(queueName, start, stop, (err, data) => {
    const results = (data && Array.isArray(data) ? data : []).filter(item => item.match(/\{"/g)).map(JSON.parse);
    resolve(results.reverse());
  }));
}

function sRange(queueName, start, stop) {
  return new Promise(resolve => dbs.client.lrange(queueName, 0, stop + start - 1, (err, data) => {
    const results = (data && Array.isArray(data) ? data : []).filter(item => item.match(/\{"/g)).map(JSON.parse);
    resolve(results.reverse().slice(start, stop));
  }));
}

function lastOne(_x5) {
  return _lastOne.apply(this, arguments);
}

function _lastOne() {
  _lastOne = _asyncToGenerator(function* (queueName) {
    let count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return _lodash.default.get((yield range(queueName, 0, count - 1)), '[0]');
  });
  return _lastOne.apply(this, arguments);
}

function firstOne(_x6) {
  return _firstOne.apply(this, arguments);
}

function _firstOne() {
  _firstOne = _asyncToGenerator(function* (queueName) {
    let count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return _lodash.default.get((yield range(queueName, count * -1, -1)).reverse(), '[0]');
  });
  return _firstOne.apply(this, arguments);
}

function length(queueName) {
  return new Promise(resolve => dbs.client.llen(queueName, (err, data) => resolve(data))).catch(_server.log);
}

function reset(queueName) {
  return new Promise(resolve => dbs.client.del(queueName, 0, -1, (err, data) => resolve(data))).catch(_server.log);
}

function last(_x7) {
  return _last.apply(this, arguments);
}

function _last() {
  _last = _asyncToGenerator(function* (queueName) {
    let count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return yield range(queueName, 0, count - 1);
  });
  return _last.apply(this, arguments);
}

function first(_x8) {
  return _first.apply(this, arguments);
}
/*
 * Timer Functions
 */


function _first() {
  _first = _asyncToGenerator(function* (queueName) {
    let count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return yield range(queueName, count * -1, -1);
  });
  return _first.apply(this, arguments);
}

function pause() {
  let mins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      return resolve(timeout);
    }, 1000 * mins);
  });
}

function delay() {
  let secs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      return resolve(timeout);
    }, 1000 * secs);
  });
}

function clearDelay(timeout) {
  Promise.resolve(() => clearTimeout(timeout)); //eslint-disable-line
}

function publish(channel, val) {
  return new Promise((resolve, reject) => {
    const createdAt = new Date();

    const data = _objectSpread({}, val, {
      createdAt: createdAt
    });

    dbs.publisher.publish(channel, JSON.stringify(data), err => err ? reject() : resolve(data));
  });
}