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
            'token': window.localStorage.getItem("playerToken") ? window.localStorage.getItem("playerToken") : null
          }
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
  },
  post(url, data) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await fetch(httpType + URL() + url, {
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'token': window.localStorage.getItem("playerToken") ? window.localStorage.getItem("playerToken") : null
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
  return axios.post("/xserver/player/login", params);
}

/* 首页 */

//取款申请
export async function createReview(params) {
  return axios.post("/xserver/system/createReview", params);
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
//消息
export async function queryMessage(params) {
  return axios.get(`/xnosql/message/query`, params);
}

/* 个人中心 */
//交易记录
export async function vroundPage(params) {
  return axios.get(`/xnosql/vround/page`, params);
}
//存取款记录
export async function billPage(params) {
  return axios.get(`/xnosql/bill/page`, params);
}
//玩家可取款金额
export async function playerGetBalance(params) {
  return axios.get(`/xserver/player/getBalance`, params);
}

//获取个人资料
export async function playerGet(params) {
  return axios.get(`/xnosql/player/get/${params.id}`, params);
}