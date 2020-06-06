const koa = require('koa')
const app = new koa()

app.use(async function(ctx, next) {
  console.log('>> one')
  await next()
  console.log('<< one')
})

app.use(async function(ctx, next) {
  console.log('>> two')
  ctx.body = 'two'
  
  // 如果这里不执行 next()
  // 那么 接下来的 middleware 都不会执行
  // 响应直接从这里返回了
  await next()
  console.log('<< two')
})

app.use(async function(ctx, next) {
  console.log('>> three')
  await next()
  console.log('<< three')
})

app.listen(3000)