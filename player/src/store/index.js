import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: []
  },
  mutations: {
    setuserInfo(state, params) {
      state.userInfo = params
    }
  },
  actions: {

  }
})
