"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rolesRequired;

var _config = _interopRequireDefault(require("config"));

var _server = _interopRequireDefault(require("../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const _config$get = _config.default.get('credentials'),
      token = _config$get.token;

function getToken(_ref) {
  let header = _ref.request.header,
      token = _ref.query.token;

  if (header && header.authorization) {
    const parts = header.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
    return header.authorization;
  }

  return token;
}

function rolesRequired(_x, _x2) {
  return _rolesRequired.apply(this, arguments);
}

function _rolesRequired() {
  _rolesRequired = _asyncToGenerator(function* (ctx, next) {
    try {
      const userToken = getToken(ctx);
      if (!token) ctx.throw(401);

      if (userToken !== token) {
        ctx.user = {
          token: token
        };
        return next();
      }

      const roles = ['admin', 'api']; //this should be coming from a user API - just for example

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      const foundRole = args.some(arg => roles.find(role => role === arg));
      return foundRole ? next() : ctx.throw(403, 'You are not Authorized');
    } catch (err) {
      _server.default.error(err);

      ctx.throw(403, 'You are not Authorized');
    }

    return undefined;
  });
  return _rolesRequired.apply(this, arguments);
}