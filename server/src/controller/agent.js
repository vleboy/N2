const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const captchapng = require('captchapng')
const _ = require('lodash')
const { RoleEnum, CollectionEnum, getBalanceById } = require('../util/util')
const Router = require('koa-router')
const router = new Router()

const VerifyCode = {}

/**
 * （代理/管理员）登录接口
 */
router.post('/login', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.userName || !inparam.userPwd || !inparam.code) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    if (inparam.code != VerifyCode[inparam.userName].code || VerifyCode[inparam.userName].exp < Date.now()) {
        return ctx.body = { err: true, res: '验证码错误或过期' }
    }
    let agentInfo = await mongodb.collection(CollectionEnum.agent).findOne({ userName: inparam.userName })
    if (!agentInfo) {
        return ctx.body = { err: true, res: '帐号不存在' }
    }
    if (!bcrypt.compareSync(agentInfo.userPwd, inparam.userPwd)) {
        return ctx.body = { err: true, res: '密码不正确' }
    }
    delete VerifyCode[inparam.userName]
    let token = jwt.sign({
        id: agentInfo.id,
        role: agentInfo.role,
        userName: agentInfo.userName,
        userNick: agentInfo.userNick,
        parentId: agentInfo.parentId,
        level: agentInfo.level,
        subrole: agentInfo.subrole
    }, config.auth.secret)
    ctx.body = { id: agentInfo.id, userNick: agentInfo.userNick, token }
})

/**
 * 获取验证码
 */
router.post('/captcha', async function (ctx, next) {
    let inparam = ctx.request.body
    if (!inparam.userName) {
        return ctx.body = { err: true, res: "请检查入参" }
    }
    inparam.code = _.random(1000, 9999)
    VerifyCode[inparam.userName] = { code: inparam.code, exp: Date.now() + 3 * 60 * 1000 }
    // 生成验证码的base64返回
    let p = new captchapng(80, 30, inparam.code)
    p.color(255, 255, 255, 0) // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255)  // Second color: paint (red, green, blue, alpha)
    // 结果返回
    ctx.body = { err: false, res: p.getBase64() }
})

/**
 * 代理列表以树型结构返回
 */
router.get('/tree', async (ctx, next) => {
    const token = ctx.tokenVerify
    let mongodb = global.mongodb
    //查出所有代理
    let agentArr = await mongodb.collection(CollectionEnum.agent).find({ role: RoleEnum.agent }).toArray()
    if (token.role != 'admin') { //任意层级代理需要过滤代理
        agentArr = _.filter(agentArr, (o) => { return o.levelIndex.indexOf(token.id) != -1 })
    }
    agentArr = _.sortBy(agentArr, ['level'])
    let promiseArr = []
    for (let item of agentArr) {
        promiseArr.push(new Promise(async (resolve, reject) => {
            item.balance = await getBalanceById(mongodb, item.id, item.role, item.lastBalanceTime, item.lastBalance)
            resolve()
        }))
    }
    await Promise.all(promiseArr)
    let data = []
    if (token.role == 'admin') {
        data.push({ id: 0, userNick: token.userNick, userName: token.userName, children: [] })
    } else {
        data.push({ ...agentArr.shift(), children: [] })
    }
    tree(data, agentArr)
    ctx.body = data[0].children
})

function tree(treeArray, array) {
    // 遍历所有节点
    for (let treeNode of treeArray) {
        let id = treeNode.id
        let children = treeNode.children || []
        // 遍历剩余节点
        for (let j = 0; j < array.length; j++) {
            let item = array[j]
            item.children = []
            // 找到父亲，加入父亲节点，并从剩余节点删除
            if (item.parentId == id) {
                children.push(item)
                treeNode.agentCount += 1
                array.splice(j, 1)
                j--
            }
        }
        // 剩余节点不为0时，递归查询
        if (array.length != 0) {
            tree(children, array)
        }
    }
}

module.exports = router