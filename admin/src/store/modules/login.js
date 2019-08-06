import { updatePassword } from "@/service/index";
import { Message } from "iview";
export const login = {
  state: {
    infos: {},
    admininfo: {},
    balance: null,
    waterfall: []
  },
  mutations: {
    saveWaterfall(state, { params }) {
      state.waterfall = params;
    },
    saveInfo(state, { params }) {
      state.infos = params;
    },
    updateAdmin(state, { params }) {
      state.admininfo = params;
    },
    updateBill(state, { params }) {
      state.balance = params;
    }
  },
  actions: {
    changePassword({ commit }, params) {
      return updatePassword(params);
    },
    updatePwd({ commit }, params) {
      updatePassword(params).then(res => {
        if (res.code == 0) {
          Message.success("修改成功");
        }
      });
    }
  }
};
