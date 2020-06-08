/**
 * Negotiation example
 */

const Koa = require('koa')

const app = new Koa()

const tobi = {
  _id: '123',
  name: 'tobi',
  species: 'ferret',
}

const loki = {
  _id: '321',
  name: 'loki',
  species: 'ferret',
}

const users = {
  tobi,
  loki,
}

app.use(async function(ctx, next) {
  await next()

  // no body? nothing to format, early return
  if (!ctx.body) return

  const type = ctx.accepts('json', 'html', 'xml', 'text')

  // not acceptable
  if (type === false) ctx.throw(406)

  // accepts json, koa handles this for us
  if (type === 'json') return

  if (type === 'xml') {
    ctx.type = 'xml'
    ctx.body = '<name>' + ctx.body.name + '</name>'
    return
  }

  if (type === 'html') {
    ctx.type = 'html'
    ctx.body = '<h1>' + ctx.body.name + '</h1>'
    return
  }

  // default
  ctx.type = 'text'
  ctx.body = ctx.body.name
})

// filter responses, in this case remove ._id
// since it's private
app.use(async function(ctx, next) {
  await next()

  if (!ctx.body) return

  delete ctx.body._id
})

app.use(async function(ctx) {
  const name = ctx.path.slice(1)
  const user = users[name]
  ctx.body = user
})

app.listen(3000, function() {
  console.log('App started on 3000...')
})