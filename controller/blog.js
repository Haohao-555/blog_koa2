const xss = require('xss')
const { escape, exec } = require('../db/mysql')

//获取博客列表
const getList = async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        author = escape(author)
        sql += ` and author = ${author} `
    }
    if (keyword) {
        keyword = escape(keyword)
        sql += ` and title like %${keyword}%`
    }
    sql += 'order by createtime desc; '

    return await exec(sql)
}

//获取博客详细内容
const getDetail = async (id) => {
    id = escape(id)
    let sql = `select content,title,author,id from blogs where id = ${id}`
    const rows = await exec(sql)
    return rows[0]
}

//更新博客
const updateBlog = async (id, blogData = {}) => {
    const content = escape(xss(blogData.content))
    const title = escape(xss(blogData.title))
    id = escape(xss(id))
    let sql = `update blogs set title=${title}, content=${content} where id=${id}`
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}

//删除博客
const delBlog = async (id, author) => {
    id = xss(escape(id))
    author = xss(escape(author))
    let sql = `delete from blogs where id=${id} and author=${author};`
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
}

//增加博客
const newBlog = async (blogData = {}) => {
    const title = escape(xss(blogData.title))
    const content = escape(xss(blogData.content))
    const author = escape(xss(blogData.author))
    const createTime = Date.now()
    const sql = `insert into blogs (title, content, createtime, author)
                values (${title}, ${content}, ${createTime}, ${author})`
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }

}
module.exports = {
    getList,
    getDetail,
    updateBlog,
    delBlog,
    newBlog
}