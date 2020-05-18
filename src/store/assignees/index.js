import Vue from "vue";
import Vuex from "vuex";

import { add, getAll, edit, set } from "@/store/assignees/types";
import { generateNewId } from "@/utils";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: [{ id: 0, name: "Default" }],
  getters: {
    [getAll]: state => state
  },
  mutations: {
    [set]: (state, list) => {
      state.splice(0);
      state.push(...list);
    },
    [add]: (state, assignee) => {
      assignee.id = generateNewId(Object.keys(state));
      state.push(assignee);
    },
    [edit]: (state, assignee) => {
      const i = state.findIndex(a => a.id === assignee.id);
      Vue.set(state, i, assignee);
    }
  }
};
