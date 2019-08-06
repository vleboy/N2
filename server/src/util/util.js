const _ = require('lodash')
const bcrypt = require('bcryptjs')

//加减点枚举
const ProjectEnum = {
    addPoint: '加点',
    reducePoint: '减点'
}
//角色枚举
const RoleEnum = {
    agent: 'agent',
    admin: 'admin',
    player: 'player'
}
//数据库集合枚举
const CollectionEnum = {
    agent: 'agent',
    agentBill: 'agentBill',
    message: 'message',
    player: 'player',
    playerBill: 'playerBill',
    review: 'review',
    subrole: 'subrole'
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
    ProjectEnum,
    RoleEnum,
    CollectionEnum
}