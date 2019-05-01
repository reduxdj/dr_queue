"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _db = require("../redis/db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const api = 'publisher';
const router = new _koaRouter.default();
router.prefix("/api/".concat(api));
router.post('/:channel', (ctx, next) =>
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (ctx) {
    try {
      const paths = (ctx.params.channel || '').split(':');

      const _paths = _toArray(paths),
            env = _paths[0],
            appName = _paths[1],
            resourceName = _paths[2],
            resourceKey = _paths[3],
            extraPaths = _paths.slice(4);

      if (!appName) throw 'Error', 'Channel Name is undefined';
      const channelName = "".concat(env, ":").concat(appName);
      ctx.body = {
        ok: true,
        data: yield (0, _db.publish)(channelName, _objectSpread({
          env: env,
          appName: appName,
          resourceName: resourceName,
          ts: new Date(),
          resourceKey: resourceKey
        }, extraPaths, ctx.request.body))
      };
    } catch (err) {
      ctx.throw(422);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
var _default = router;
exports.default = _default;