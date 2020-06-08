/**
 * Cookies demo
 */

const Koa = require('koa')

const app = new Koa()

app.use(async function(ctx, next) {
  const n = ~~ctx.cookies.get('view') + 1
  ctx.cookies.set('view', n)
  ctx.body = n + ' views'
})

app.listen(3000, function() {
  console.log('App is started on 3000...')
})