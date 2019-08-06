import { Message } from "iview";
import { URL, httpType } from "./urlConfig";

const axios = {
  async get(url) {
    return new Promise(async (resolve, reject) => {
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

//获取代理列表
export async function getAgentList() {
  return axios.get("/xserver/agent/tree");
}

//创建代理
export async function createAgent(params) {
  return axios.post("/xnosql/agent/create", params);
}

//加减点
export async function setPoints(params) {
  return axios.post("/xserver/user/handlerPoint", params);
}

//获取玩家列表
export async function getplayerList() {
  return axios.get("/xnosql/player/query");
}

//创建玩家
export async function createPlayer(params) {
  return axios.post("/xnosql/player/create", params);
}







