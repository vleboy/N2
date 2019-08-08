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
//启用/停用枚举
const StatusEnum = {
    Enable: 1,
    Disable: 0
}
//审核单转态枚举
const ReviewEnum = {
    Process: 0,
    Agree: 1,
    Refuse: 2,
}

//获取一个唯一的ID值
function GetUniqueID() {
    let num = `${Date.now()}${_.random(10, 99)}`
    return +num
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

//获取玩家余额
function getPlayerBalance(mongodb, playerId) {
    // 查询玩家

    // 根据时间查询流水

    // 汇总余额

}
//获取代理余额
function getAgentBalance(mongodb, agentId) {

}

module.exports = {
    CheckType,
    GetHashPwd,
    ProjectEnum,
    RoleEnum,
    CollectionEnum,
    ReviewEnum,
    StatusEnum,
    GetUniqueID,
    getPlayerBalance,
    getAgentBalance
}