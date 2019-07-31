//路由相关
const Router = require('koa-router')
const router = new Router()

/**
 * 创建角色接口
 */
router.post('/system/createRole',async (ctx,next)=>{

})

/**
 * 删除角色接口
 */
router.post('/system/delRole',async (ctx,next)=>{
    
})

/**
 * 创建消息接口
 */
router.post('/system/createMessage',async (ctx,next)=>{
    
})

/**
 * 删除消息接口
 */
router.post('/system/delMessage',async (ctx,next)=>{
    
})

/**
 * 查询消息列表接口
 */
router.post('/system/messageList',async (ctx,next)=>{
    
})

/**
 * 查询充值/提现接口
 */
router.post('/system/queryReviewList',async (ctx,next)=>{
    
})

/**
 * 审核充值/提现接口
 */
router.post('/system/handlerReview',async (ctx,next)=>{
    
})



module.exports = router