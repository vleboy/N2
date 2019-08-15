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
export async function queryAgent(params) {
  return axios.get("/xserver/agent/tree", params);
}

//创建代理
export async function createAgent(params) {
  return axios.post("/xnosql/agent/create", params);
}

//停用启用代理
export async function agentStatus(params) {
  return axios.post("/xnosql/agent/update", params);
}

//加减点
export async function setPoints(params) {
  return axios.post("/xserver/system/handlerPoint", params);
}


/* 玩家中心 */
//获取玩家列表
export async function queryPlayer(params) {
  return axios.get("/xnosql/player/page", params);
}

//创建玩家
export async function createPlayer(params) {
  return axios.post("/xnosql/player/create", params);
}

//停用启用玩家
export async function playerStatus(params) {
  return axios.post("/xnosql/player/update", params);
}


/* 账单查询 */
export async function queryBill(params) {
  return axios.get("/xnosql/bill/page", params);
}


/* 审核中心 */

//审核列表
export async function queryAudit(params) {
  return axios.get("/xnosql/review/page", params);
}

//审核操作
export async function operateAudit(params) {
  return axios.post("/xserver/system/handlerReview", params);
}


/* 管理员中心 */

//创建管理员角色
export async function createRole(params) {
  return axios.post("/xnosql/subrole/create", params);
}

//查询管理员角色
export async function queryRole(params) {
  return axios.get("/xnosql/subrole/query", params);
}

//修改管理员角色
export async function updateRole(params) {
  return axios.post("/xnosql/subrole/update", params);
}

//删除管理员角色
export async function deleteRole(params) {
  return axios.post(`/xnosql/subrole/delete/${params.id}`, params);
}

//查询管理员列表
export async function queryAdmin(params) {
  return axios.get("/xnosql/agent/query", params);
}

//创建管理员
export async function createAdmin(params) {
  return axios.post("/xserver/system/create", params);
}

//修改管理员
export async function updateAdmin(params) {
  return axios.post("/xnosql/agent/update", params);
}

//删除管理员
export async function deleteAdmin(params) {
  return axios.post(`/xnosql/agent/delete/${params.id}`, params);
}

//查询配置中心
export async function configQuery(params) {
  return axios.get("/xnosql/config/query", params);
}

//修改配置中心
export async function configUpdate(params) {
  return axios.post("/xnosql/config/update", params);
}