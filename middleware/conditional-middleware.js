/**
 * Conditional middleware demo
 */

const Koa = require('koa')
const logger = require('koa-logger')

const app = new Koa()

function ignoreAsserts(mw) {
  return async function(ctx, next) {
    if (/(\.js|\.css|\.ico)$/.test(ctx.path)) {
      await next()
    } else {
      await mw.call(this, ctx, next)
    }
  }
}

app.use(ignoreAsserts(logger()))

app.use(async function(ctx) {
  ctx.body = 'Hello, World'
})

app.listen(3000, function() {
  console.log('App is started on 3000...')
})

