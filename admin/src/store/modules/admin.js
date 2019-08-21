export const admin = {
  state: {
    playerPoint: false,
    agentPoint: false,
    operateAgent: false,
    createPlayer: false,
    editPlayer: false,
    agentDetail: false,
    playerDetail: false,
    createRole: false,
    operateAdmin: false,
    operateConfig: false,
    auditDetail: false,
    agentPointInfo: {},
    playerPointInfo: {},
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
    auditInfo: {},

    //存放数据
    info: {},
    //显示抽屉
    isShowDrawer: false
  },
  mutations: {
    /* 显示抽屉组件 */
    showDrawer(state, params) {
      state.isShowDrawer = params
    },
    //设置传入数据
    setDrawerInfo(state, params) {
      state.info = params
    },



    showPlayerPoint(state, params) {
      state.playerPoint = params
    },
    showAgentPoint(state, params) {
      state.agentPoint = params
    },
    showOperateAgent(state, params) {
      state.operateAgent = params
    },
    showCreatePlayer(state, params) {
      state.createPlayer = params
    },
    showEditPlayer(state, params) {
      state.editPlayer = params
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
    setAgentPointInfo(state, params) {
      state.agentPointInfo = params
    },
    setPlayerPointInfo(state, params) {
      state.playerPointInfo = params
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
