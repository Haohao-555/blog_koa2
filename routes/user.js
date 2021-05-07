const login = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const router = require('koa-router')()

router.prefix('/api/user')

//用户登录
router.post('/login', async(ctx, next) => {
   //获取请求数据
   const {username, password} = ctx.request.body
   const data = await login(username,password)
   if (data.username) {
      ctx.session.username = data.username
      ctx.session.realname = data.realname

      ctx.body= new SuccessModel()
      return
   }
   ctx.body = new ErrorModel('登录失败')
})

module.exports = router