import { URL, httpType } from "./urlConfig";
import { Notify } from 'vant';

const axios = {
  async get(url, params) {
    return new Promise(async (resolve, reject) => {
      if (params) {
        let paramsArray = [];
        //拼接参数  
        Object.keys(params).forEach(key => {
         params[key] && paramsArray.push(key + '=' + params[key])
        })
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&')
        } else {
          url += '&' + paramsArray.join('&')
        }
      }
      try {
        let res = await fetch(httpType + URL() + url, {
          headers: {
            'token': window.localStorage.getItem("agentToken") ? window.localStorage.getItem("agentToken") : null
          }
        })
        let obj = await res.json()
        if (obj.err) {
          Notify({
            message: obj.res,
            duration: 2000,
            background: 'red',
          });
         
          reject(obj)
        } else {
          resolve(obj)
        }
      } catch (error) {
        Notify({
          message: '网络连接错误',
          duration: 2000,
          background: 'red'
        });
        reject(error)
      }
    })
  },
  post(url, data) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await fetch(httpType + URL() + url, {
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'token': window.localStorage.getItem("agentToken") ? window.localStorage.getItem("agentToken") : null
          },
          method: 'POST'
        })
        let obj = await res.json()
        if (obj.err) {
          Notify({
            message: obj.res,
            duration: 2000,
            background: 'red'
          });

          reject(obj)
        } else {
          resolve(obj)
        }
      } catch (error) {
        Notify({
          message: '网络连接错误',
          duration: 2000,
          background: 'red'
        });
        reject(error)
      }
    })
  }
}

//业务逻辑
export function httpRequest(method, url, params) {
  switch (method) {
    case "get":
      return axios.get(url, params);
      break;
    case "post":
      return axios.post(url, params);
      break;
    case "put":
      return http(Image(method, url, params));
      break;
  }
}

/* 登录 */
export async function logIn(params) {
  return axios.post("/xserver/agent/login", params);
}

/* 首页 */
//获取首页数据
export async function getView(params) {
  return axios.get("/xserver/agent/realtime", params);
}

//取款金额
export async function getBalance(params) {
  return axios.get("/xserver/agent/getBalance", params);
}

//消息
export async function queryMessage(params) {
  return axios.get(`/xnosql/message/query`, params);
}

//取款申请
export async function createReview(params) {
  return axios.post("/xserver/system/createReview", params);
}
//存取款记录
export async function billPage(params) {
  return axios.get(`/xnosql/bill/page`, params);
}
//存取款通道费
export async function depositBill(params) {
  return axios.get("/xserver/agent/channelFeeDetail", params);
}
//红利加返水
export async function commissionBill(params) {
  return axios.get("/xserver/agent/commissionFeeDetail", params);
}
//平台费详情
export async function platformBill(params) {
  return axios.get("/xserver/agent/platformFeeDetail", params);
}
//总输赢
//红利加返水 //type = commission
export async function vroundPage(params) {
  return axios.get("/xnosql/vround/page", params);
}


//佣金报表
export async function commissionPage(params) {
  return axios.get("/xnosql/profit/page", params);
}

//玩家报表
export async function playerReport(params) {
  return axios.get("/xserver/agent/playerReport", params);
}


//添加银行卡
export async function addBankCard(params) {
  return axios.post("/xserver/bankcard/create", params);
}
//删除银行卡
export async function deleteBankCard(params) {
  return axios.post(`/xserver/bankcard/delete/${params.cardNo}`, params);
}
//获取银行卡列表
export async function getCardList(params) {
  return axios.get("/xserver/bankcard/get", params);
}


/* 设置 */
//修改密码
export async function updatePwd(params) {
  return axios.post("/xnosql/agent/update", params);
}

//个人信息
