import Vue from "vue";
import Vuex from "vuex";

import counter from "./counter";
import tasks from "./tasks";
import assignees from "@/store/assignees";

export const modules = {
  counter: "counter",
  tasks: "tasks",
  assignees: "assignees"
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    [modules.counter]: counter,
    [modules.tasks]: tasks,
    [modules.assignees]: assignees
  }
});
