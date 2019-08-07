import { Message } from "iview";
import { URL, httpType } from "./urlConfig";

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
          Message.warning(obj.res)
          reject(obj)
        } else {
          resolve(obj)
        }
      } catch (error) {
        Message.warning('网络连接错误')
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
          Message.warning(obj.res)
          reject(obj)
        } else {
          resolve(obj)
        }
      } catch (error) {
        Message.warning('网络连接错误')
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

//登录
export async function logIn(params) {
  return axios.post("/xserver/agent/login", params);
}


/* 代理中心 */
//获取代理列表
export async function queryAgent() {
  return axios.get("/xserver/agent/tree");
}

//创建代理
export async function createAgent(params) {
  return axios.post("/xnosql/agent/create", params);
}

//停用启用代理
export async function agentStatus(params) {
  return axios.post("/xnosql/agent/update", params);
}

//代理账单
export async function queryAgentBill(params) {
  return axios.get("/xnosql/agentBill/query", params);
}

//加减点
export async function setPoints(params) {
  return axios.post("/xserver/system/handlerPoint", params);
}


/* 玩家中心 */
//获取玩家列表
export async function queryPlayer(params) {
  return axios.get("/xnosql/player/query", params);
}

//创建玩家
export async function createPlayer(params) {
  return axios.post("/xnosql/player/create", params);
}

//停用启用玩家
export async function playerStatus(params) {
  return axios.post("/xnosql/player/update", params);
}

//玩家账单
export async function queryPlayerBill(params) {
  return axios.get("/xnosql/playerBill/query", params);
}


/* 审核中心 */

//审核列表
export async function queryAudit(params) {
  return axios.get("/xnosql/review/query", params);
}

//审核操作
export async function operateAudit(params) {
  return axios.post("/xserver/system/handlerReview", params);
}




