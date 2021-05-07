const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const REDIS_CONF = require('./conf/db')

const fs = require('fs')
const path = require('path')
const morgan = require('koa-morgan')
// const index = require('./routes/index')
// const users = require('./routes/users')

const blogRouter = require('./routes/blog')
const userRoutet = require('./routes/user')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//session 与  redis
app.keys = ['dfhQWE_123#df']
app.use(session({
  //配置cookie
  cookie:{
    path:"/",
    httpOnly:true,
    maxAge:24 * 60 * 60 * 1000
  },
  //配置redis
  store: redisStore({
    all:`${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  app.use(morgan('dev'),{
    stream:process.stdout //打印到控制台 （默认）
  })
} else {
  //线上环境
  const logfileName = path.join(__dirname, "logs","access.log")
  const writeStream = fs.createWriteStream(logfileName, {
    flags:'a'
  })
  app.use(morgan('combined',{
    stream:writeStream
  }))
}

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

app.use(blogRouter.routes(), blogRouter.allowedMethods())
app.use(userRoutet.routes(), userRoutet.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
