const _ = require('lodash')
const bcrypt = require('bcryptjs')

const TIMEOUT = {
    ALL_ALLIN: 2000
}

//检查类型
function CheckType(o) {
    let s = Object.prototype.toString.call(o)
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}
//加密
function GetHashPwd(pwd) {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(pwd, salt)
    return hash
}

module.exports = {
    CheckType,
    GetHashPwd,
    TIMEOUT
}