import Vue from 'vue'
import Vuex from 'vuex'
import {login} from './modules/login'
import {home} from './modules/home'
import { admin } from './modules/admin'
Vue.use(Vuex)
export const store = new Vuex.Store({
  state:{
    
  },
  mutations:{
    
  },
  modules: {
    login,
    home,
    admin
  }
})