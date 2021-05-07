const {exec,escape} = require('../db/mysql')
const xss = require('xss')
const login = async(username,paasword) => {
    username = escape(xss(username))
    paasword = escape(xss(paasword))
    let sql = `select username, realname from users where username=${username} and password=${password}`
    const row = await exec(sql)
    return row[0] || {}
}
module.exports =login
