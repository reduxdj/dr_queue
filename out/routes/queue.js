"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _db = require("../redis/db");

var _server = require("../server");

var _middleware = _interopRequireDefault(require("../middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const api = 'queue';
const router = new _koaRouter.default();
router.prefix("/api/".concat(api));
router.post('/:queueName/reset', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: yield (0, _db.reset)(ctx.params.queueName)
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/:queueName/length', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: yield (0, _db.length)(ctx.params.queueName)
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('/:queueName/pop', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: yield (0, _db.pop)(ctx.params.queueName)
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('/:queueName/pop_left', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: yield (0, _db.popLeft)(ctx.params.queueName)
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());
router.post('/:queueName/pop_right', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: yield (0, _db.popRight)(ctx.params.queueName)
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}());
router.get('/:queueName/last', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: (yield (0, _db.hasNext)(ctx.params.queueName)) ? yield (0, _db.last)(ctx.params.queueName) : Promise.resolve({})
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x6) {
    return _ref6.apply(this, arguments);
  };
}());
router.get('/:queueName/first', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: (yield (0, _db.hasNext)(ctx.params.queueName)) ? yield (0, _db.first)(ctx.params.queueName) : Promise.resolve({})
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
}());
router.get('/:queueName/first/:count', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: (yield (0, _db.hasNext)(ctx.params.queueName)) ? yield (0, _db.first)(ctx.params.queueName, ctx.params.count) : Promise.resolve({})
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x8) {
    return _ref8.apply(this, arguments);
  };
}());
router.get('/:queueName/last/:count', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: (yield (0, _db.hasNext)(ctx.params.queueName)) ? yield (0, _db.last)(ctx.params.queueName, ctx.params.count) : Promise.resolve({})
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x9) {
    return _ref9.apply(this, arguments);
  };
}());
router.post('/:queueName/push', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: yield (0, _db.push)(ctx.params.queueName, ctx.request.body)
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x10) {
    return _ref10.apply(this, arguments);
  };
}());
router.post('/:queueName/push_right', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: yield (0, _db.pushRight)(ctx.params.queueName, ctx.request.body)
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x11) {
    return _ref11.apply(this, arguments);
  };
}());
router.get('/:queueName', (ctx, next) => (0, _middleware.default)(ctx, next, 'admin', 'api'),
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(function* (ctx) {
    try {
      ctx.body = {
        ok: true,
        data: yield (0, _db.range)(ctx.params.queueName, (yield (0, _db.length)(ctx.params.queueName)))
      };
    } catch (err) {
      _server.Logger.error(err);

      ctx.throw(422);
    }
  });

  return function (_x12) {
    return _ref12.apply(this, arguments);
  };
}());
var _default = router;
exports.default = _default;