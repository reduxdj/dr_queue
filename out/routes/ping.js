"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _server = require("../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const api = 'ping';
const router = new _koaRouter.default();
router.prefix("/api/".concat(api));
router.get('/',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (ctx) {
    ctx.body = {
      ok: true,
      data: {
        started: _server.upTime
      }
    };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
var _default = router;
exports.default = _default;