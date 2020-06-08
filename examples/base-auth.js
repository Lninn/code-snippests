/**
 * basic-auth demo
 */

/**
 * App dependencies
 */
const Koa = require('koa')
const auth = require('koa-basic-auth')

const app = new Koa()

// custom 401 handling
app.use(async function(ctx, next) {
  try {
    await next()
  } catch (err) {
    // console.dir(err)
    if (err.status === 401) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.body = 'cant baz that'
    } else {
      throw err
    }
  }
})

// require auth
app.use(auth({ name: 'hello', pass: 'world' }))

// secret response
app.use(async function(ctx) {
  ctx.body = 'secret'
})

app.listen(3000)
