import Vue from "vue";
import Vuex from "vuex";

import tasks from "@/store/tasks";
import assignees from "@/store/assignees";
import { INIT_STORE, persist } from "@/store/plugins";

export const modules = {
  tasks: "tasks",
  assignees: "assignees"
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    [modules.tasks]: tasks,
    [modules.assignees]: assignees
  },
  mutations: {
    [INIT_STORE]: (state, init) => Object.assign(state, init)
  },
  plugins: [persist]
});
