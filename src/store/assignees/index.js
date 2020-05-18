import Vue from "vue";
import Vuex from "vuex";

import { add, getAll, edit } from "@/store/assignees/types";
import { generateNewId } from "@/utils";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    0: {
      id: 0,
      name: "Default"
    }
  },
  getters: {
    [getAll]: state => Object.values(state)
  },
  mutations: {
    [add]: (state, assignee) => {
      assignee.id = generateNewId(Object.keys(state));
      Vue.set(state, assignee.id, assignee);
    },
    [edit]: (state, assignee) => {
      Vue.set(state, assignee.id, assignee);
    }
  }
};
