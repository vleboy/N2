const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const captchapng = require('captchapng')
const _ = require('lodash')
const { ProjectEnum, RoleEnum, CollectionEnum, GetUniqueID } = require('../util/util')
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
    // if (inparam.code != VerifyCode[inparam.userName].code || VerifyCode[inparam.userName].exp < Date.now()) {
    //     return ctx.body = { err: true, res: '验证码错误或过期' }
    // }
    let agentInfo = await mongodb.collection(CollectionEnum.agent).findOne({ userName: inparam.userName })
    if (!agentInfo) {
        return ctx.body = { err: true, res: '帐号不存在' }
    }
    // if (!bcrypt.compareSync(agentInfo.userPwd, inparam.userPwd)) {
    //     return ctx.body = { err: true, res: '密码不正确' }
    // }
    delete VerifyCode[inparam.userName]
    let token = jwt.sign({
        id: agentInfo.id,
        role: agentInfo.role,
        userName: agentInfo.userName,
        userNick: agentInfo.userNick,
        parentId: agentInfo.parentId,
        level: agentInfo.level
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
 * 代理之间的转账接口
 * （代理给下级代理转账，代理给玩家转账）
 */
router.post('/handlerPoint', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.ownerId || !inparam.amount || !inparam.project || !inparam.role) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    // 检查代理或玩家是否可以进行转账操作
    await checkAgentHandlerPoint(inparam, token)
    // 加点操作
    if (inparam.project == ProjectEnum.addPoint) {
        // 给代理加点
        if (inparam.role == RoleEnum.agent) {
            //操作代理减点
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: token.id, ownerName: token.userName, ownerNick: token.userNick, parentId: token.parentId, createAt: Date.now() })
            //请求代理加点
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount), ownerId: inparam.ownerId, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
        }
        // 给玩家加点
        if (inparam.role == RoleEnum.player) {
            //操作代理减点
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: token.id, ownerName: token.userName, ownerNick: token.userNick, parentId: token.parentId, createAt: Date.now() })
            //请求玩家加点
            await mongodb.collection(CollectionEnum.playerBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount), ownerId: inparam.ownerId, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
        }
    }
    // 减点操作
    if (inparam.project == ProjectEnum.reducePoint) {
        // 给代理减点
        if (inparam.role == RoleEnum.agent) {
            //操作代理加点
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount), ownerId: token.id, ownerName: token.userName, ownerNick: token.userNick, parentId: token.parentId, createAt: Date.now() })
            //请求代理减点
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.ownerId, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
        }
        // 给玩家减点
        if (inparam.role == RoleEnum.player) {
            //操作代理加点
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount), ownerId: token.id, ownerName: token.userName, ownerNick: token.userNick, parentId: token.parentId, createAt: Date.now() })
            //请求玩家减点
            await mongodb.collection(CollectionEnum.playerBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.ownerId, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
        }
    }
    ctx.body = { err: false, msg: '操作成功' }
})


/**
 * 代理流水查询
 */
router.post('/queryBill', async (ctx, next) => {

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

//检查用户是否可以转账
async function checkAgentHandlerPoint(inparam, token) {
    if (inparam.role == RoleEnum.agent) {
        let agentInfo = await mongodb.collection(CollectionEnum.agent).findOne({ id: inparam.ownerId })
        if (!agentInfo || agentInfo.status == 0) {
            throw { err: true, res: '代理不存在或被停用' }
        }
        if (token.id != agentInfo.parentId) {
            throw { err: true, res: '不能跨级操作' }
        }
        let balance = 0
        if (inparam.project == ProjectEnum.addPoint) {
            balance = await getAgentBalance(token.id)
        } else if (inparam.project == ProjectEnum.reducePoint) {
            balance = await getAgentBalance(agentInfo.id)
        } else {
            throw { err: true, res: '未知操作' }
        }
        if (balance < inparam.amount) {
            throw { err: true, res: '余额不足' }
        }
        inparam.ownerName = agentInfo.userName
        inparam.ownerNick = agentInfo.userNick
        inparam.parentId = agentInfo.parentId
    } else if (inparam.role == RoleEnum.player) {
        let player = await mongodb.collection(CollectionEnum.player).findOne({ id: inparam.ownerId })
        if (!player || player.status == 0) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
        if (player.parentId != token.id) {
            throw { err: true, res: '代理只能操作自己的玩家' }
        }
        let balance = 0
        if (inparam.project == ProjectEnum.addPoint) {
            balance = await getAgentBalance(token.id)
        } else if (inparam.project == ProjectEnum.reducePoint) {
            balance = await getPlayerBalance(player.id)
        } else {
            throw { err: true, res: '未知操作' }
        }
        if (balance < inparam.amount) {
            throw { err: true, res: '余额不足' }
        }
        inparam.ownerName = player.playerName
        inparam.ownerNick = player.playerNick
        inparam.parentId = player.parentId
    } else {
        throw { err: true, res: '非法角色' }
    }
}

//获取代理的余额
async function getAgentBalance(agentId) {
    let balance = 0
    let agentGroupArr = await mongodb.collection(CollectionEnum.agentBill).aggregate([{ $match: { ownerId: agentId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of agentGroupArr) {
        if (item._id == agentId) {
            balance = item.count
            return balance
        }
    }
    return balance
}
//获取玩家的余额
async function getPlayerBalance(playerId) {
    let balance = 0
    let playerGroupArr = await mongodb.collection(CollectionEnum.playerBill).aggregate([{ $match: { ownerId: playerId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of playerGroupArr) {
        if (item._id == playerId) {
            return item.count
        }
    }
    return balance
}

module.exports = router