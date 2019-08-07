export const admin = {
  state: {
    pointDrawer: false,
    createAgent: false,
    createPlayer: false,
    agentDetail: false,
    playerDetail: false,
    pointInfo: {
      
    },
    playerInfo: {
      
    },
    agentInfo: {
      
    }
    
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
    showAgentDetail(state, params) {
      state.agentDetail = params
    },
    showPlayerDetail(state, params) {
      state.playerDetail = params
    },
    setPointInfo(state, params) {
      state.pointInfo = params
    },
    setPlayerInfo(state, params) {
      state.playerInfo = params
    },
    setAgentInfo(state, params) {
      state.agentInfo = params
    }
  },
  actions: {
    
  }
};
