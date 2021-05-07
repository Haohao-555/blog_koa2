const router = require('koa-router')()

const { getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

//查看博客列表
router.get('/list', async (ctx, next) => {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    if (ctx.query.isadmin) {
        if (ctx.session.username == null) {
            ctx.body = new ErrorModel('尚未登录')
        }
        author = ctx.session.username
    }
    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
})

//查看博客详细信息
router.get('/detail', async (ctx, next) => {
    const { id } = ctx.query
    const detail = await getDetail(id)
    ctx.body = new SuccessModel(detail)
})

//增加博客
router.post('/new', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.username
    const id = await newBlog(ctx.request.body)
    if (id <= 0) {
        ctx.body = new ErrorModel('增加博客失败')
        return
    } else {
        ctx.body = new SuccessModel()
    }
})

//删除博客
router.post('/del', loginCheck, async (ctx, next) => {
    const { id } = ctx.query
    const author = ctx.session.username
    const val = await delBlog(id, author)
    if (! val) {
        ctx.body = new ErrorModel('删除博客失败')
        return
    } else {
        ctx.body = new SuccessModel()
    } 

})

//更新博客
router.post('/update', loginCheck, async (ctx, next) => {
    const { id } = ctx.query
    ctx.request.body.author = ctx.session.username
    const val = await updateBlog(id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel()
        return
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})
module.exports = router