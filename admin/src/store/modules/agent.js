export const agent = {
  state: {
    pointDrawer: false,
    createAgent: false,
    createPlayer: false,
    info: {
      name: '',
      id: '',
      role: ''
    },
    
  },
  mutations: {
    showPointDrawer(state, params) {
      state.pointDrawer = params
    },
    showCreateAgent(state, params) {
      state.createAgent = params
    },
    showCreatePlayer(state, params) {
      state.createPlayer = params
    },
    changeInfo(state, params) {
      state.info.name = params.name
      state.info.id = params.id
      state.info.role = params.role
    },
    
  },
  actions: {
    
  }
};
