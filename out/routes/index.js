"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyRoutes;

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function applyRoutes(app) {
  const normalizedPath = require('path').join(__dirname, '../routes'); //eslint-disable-line


  _fs.default.readdirSync(normalizedPath).forEach(file => {
    const router = require("../routes/".concat(file.replace('.js', ''))).default;

    if (!file.includes('index')) {
      app.use(router.routes()).use(router.allowedMethods());
      app.use(router.routes()).use(router.allowedMethods({
        throw: true
      }));
    }
  });
}