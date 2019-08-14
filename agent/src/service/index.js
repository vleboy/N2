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
            'token': window.localStorage.getItem("Token") ? window.localStorage.getItem("Token") : null
          }
        })
        let obj = await res.json()
        if (obj.err) {
          Notify({
            message: obj.res,
            duration: 1000,
            background: 'red'
          });
         
          reject(obj)
        } else {
          resolve(obj)
        }
      } catch (error) {
        Notify({
          message: '网络连接错误',
          duration: 1000,
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
            'token': window.localStorage.getItem("Token") ? window.localStorage.getItem("Token") : null
          },
          method: 'POST'
        })
        let obj = await res.json()
        if (obj.err) {
          Notify({
            message: obj.res,
            duration: 1000,
            background: 'red'
          });

          reject(obj)
        } else {
          resolve(obj)
        }
      } catch (error) {
        Notify({
          message: '网络连接错误',
          duration: 1000,
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

//取款申请
export async function createReview(params) {
  return axios.post("/xserver/system/createReview", params);
}
//存款列表
export async function depositBill(params) {
  return axios.get("/xnosql/bill/page", params);
}
//添加银行卡
export async function addBankCard(params) {
  return axios.post("/xserver/bankcard/create", params);
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