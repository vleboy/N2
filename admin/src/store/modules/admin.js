export const admin = {
  state: {
    pointDrawer: false,
    createAgent: false,
    createPlayer: false,
    agentDetail: false,
    playerDetail: false,
    createRole: false,
    operateAdmin: false,
    operateConfig: false,
    auditDetail: false,
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
    },
    configInfo: {},
    auditInfo: {}
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
    showOperateConfig(state, params) {
      state.operateConfig = params
    },
    showAuditDetail(state, params) {
      state.auditDetail = params
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
    },
    setConfigInfo(state, params) {
      state.configInfo = params
    },
    setAuditInfo(state, params) {
      state.auditInfo = params
    }
  },
  actions: {
    
  }
};
