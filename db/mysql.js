const {MYSQL_CONF} = require('../conf/db')
const mysql = require('mysql')

//创建连接
const con = mysql.createConnection(MYSQL_CONF)

//开始连接
con.connect()

//统一处理sql函数
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

module.exports = {
    exec,
    escape:mysql.escape
}