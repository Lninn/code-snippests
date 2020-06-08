const compose = require('koa-compose')
const koa = require('koa')
const app = new koa()

async function random(ctx, next) {
  if ('/random' == ctx.path) {
    ctx.body = Math.floor(Math.random() * 10)
  } else {
    await next()
  }
}

async function backwards(ctx, next) {
  if ('/backwards' == ctx.path) {
    ctx.body = 'sdrawkcab'
  } else {
    await next()
  }
}

async function pi(ctx, next) {
  if ('/pi' == ctx.path) {
    ctx.body = String(Math.PI)
  } else {
    await next()
  }
}

const all = compose([random, backwards, pi])

app.use(all)

app.listen(3000, function() {
  console.log('Start...')
})





// create middleware
function logger(format) {
  format = format || `:method ":url"`

  return async function(ctx, next) {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url)
    
    console.log(str)

    await next()
  }
}

app.use(logger())
app.use(logger(`:method :url`))

app.listen(3000)