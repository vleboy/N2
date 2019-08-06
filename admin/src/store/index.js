import Vue from 'vue'
import Vuex from 'vuex'
import {login} from './modules/login'
import {home} from './modules/home'
import { agent } from './modules/agent'
Vue.use(Vuex)
export const store = new Vuex.Store({
  state:{
    
  },
  mutations:{
    
  },
  modules: {
    login,
    home,
    agent
  }
})