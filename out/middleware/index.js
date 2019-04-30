"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToken = getToken;
exports.default = rolesRequiredMiddleware;
exports.loggerMiddleware = loggerMiddleware;

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getToken(_ref) {
  let header = _ref.request.header,
      token = _ref.query.token;

  if (header && header.authorization) {
    const parts = header.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
    return header.authorization;
  }

  return token;
} // example roles logic
// const roles = ['admin', 'api'] //this should be coming from a user API - just for example
// const foundRole = args.some(arg => roles.find(role => role === arg))
// foundRole ? next() : ctx.throw(403, 'You are not Authorized')


function rolesRequiredMiddleware(_x, _x2) {
  return _rolesRequiredMiddleware.apply(this, arguments);
}

function _rolesRequiredMiddleware() {
  _rolesRequiredMiddleware = _asyncToGenerator(function* (ctx, next) {
    try {
      const _config$get = _config.default.get('credentials'),
            token = _config$get.token;

      const userToken = getToken(ctx);
      if (!userToken) ctx.throw(401);

      if (userToken !== token) {
        ctx.user = {
          token: token
        };
        ctx.throw(403, 'You are not Authorized');
      }

      return next();
    } catch (err) {
      //Logger.error(err)
      ctx.throw(403, 'You are not Authorized');
    }

    return undefined;
  });
  return _rolesRequiredMiddleware.apply(this, arguments);
}

function loggerMiddleware(Logger) {
  const errorIgnoreLevels = Logger.getInoreLevels();
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (ctx, next) {
        const start = new Date();
        yield next();
        const ms = new Date() - start;
        const bypassError = !!errorIgnoreLevels.find(status => ctx.status === status);
        const hasError = ctx.status >= 400 && !bypassError;
        if (hasError) Logger.error("".concat(ctx.request.origin, " ").concat(ctx.method, " ").concat(ctx.status, " ").concat(ctx.request.path, " "), _objectSpread({}, ctx.request.body, {
          ms: ms
        }));else Logger.log("".concat(ctx.request.origin, " ").concat(ctx.method, " ").concat(ctx.status, " ").concat(ctx.request.path, " "), _objectSpread({}, ctx.request.body, {
          ms: ms
        }));
      });

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
}