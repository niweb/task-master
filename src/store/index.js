import Vue from "vue";
import Vuex from "vuex";

import tasks from "./tasks";
import assignees from "@/store/assignees";

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
  }
});
