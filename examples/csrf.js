/**
 * Csrf demo
 */

/**
 * Module dependencies
 */
const Koa = require('koa')
const koaBody = require('koa-body')
const session = require('koa-session')
const CSRF = require('koa-csrf')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

/**
 * csrf need session
 */
app.keys = ['session key', 'csrf example']
app.use(session(app))
app.use(koaBody())

/**
 * csrf middleware
 */
app.use(new CSRF())

/**
 * route
 */
router.get('/token', token)
  .get('/hello', hello)
  .post('/post', post)

app.use(router.routes())

async function hello(ctx) {
  ctx.body = 'hello'
}

async function token(ctx) {
  ctx.body = ctx.csrf
}

async function post(ctx) {
  ctx.body = { ok: true }
}

app.listen(3000, function() {
  console.log('App is started on 3000...')
})