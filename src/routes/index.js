import fs from 'fs'

export default function applyRoutes(app) {
  const normalizedPath = require('path').join(__dirname, '../routes') //eslint-disable-line
  fs.readdirSync(normalizedPath).forEach(file => {
    const router = require(`../routes/${file.replace('.js', '')}`).default
    if (!file.includes('index')) {
      app.use(router.routes()).use(router.allowedMethods())
      app
        .use(router.routes())
        .use(router.allowedMethods({
          throw: true,
        }))
    }
  })
}
