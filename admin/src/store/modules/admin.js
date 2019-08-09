export const admin = {
  state: {
    pointDrawer: false,
    createAgent: false,
    createPlayer: false,
    agentDetail: false,
    playerDetail: false,
    createRole: false,
    operateAdmin: false,
    pointInfo: {},
    playerInfo: {},
    agentInfo: {},
    roleInfo: {
      roleName: '',
      permissions: [],
      operate: ''
    },
    adminInfo: {
      adminName: '',
      operate: 'create'
    }
    
  },
  mutations: {
    /* 显示抽屉组件 */
    
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
    showCreateRole(state, params) {
      state.createRole = params
    }, 
    showOperateAdmin(state, params) {
      state.operateAdmin = params
    },
    setPointInfo(state, params) {
      state.pointInfo = params
    },
    setPlayerInfo(state, params) {
      state.playerInfo = params
    },
    setAgentInfo(state, params) {
      state.agentInfo = params
    },
    setRoleInfo(state, params) {
      state.roleInfo = params
    },
    setAdminInfo(state, params) {
      state.adminInfo = params
    }
  },
  actions: {
    
  }
};
