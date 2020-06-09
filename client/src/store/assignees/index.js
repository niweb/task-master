import Vue from "vue";
import Vuex from "vuex";

import { add, getAll } from "@/store/tasks/types";
import { generateNewId } from "@/utils";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    0: {
      id: 0,
      name: "Unassigned"
    },
    1: {
      id: 1,
      name: "Nina"
    }
  },
  getters: {
    [getAll]: state => Object.values(state)
  },
  mutations: {
    [add]: (state, task) => {
      task.id = generateNewId(Object.keys(state));
      Vue.set(state, task.id, task);
    }
  }
};
