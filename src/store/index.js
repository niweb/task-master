import Vue from "vue";
import Vuex from "vuex";

import counter from "./counter";
import tasks from "./tasks";

export const modules = {
  counter: "counter",
  tasks: "tasks"
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    [modules.counter]: counter,
    [modules.tasks]: tasks
  }
});
