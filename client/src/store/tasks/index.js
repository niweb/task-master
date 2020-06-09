import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

import { add, edit, getAll, getByAssignee } from "@/store/tasks/types";
import { generateNewId } from "@/utils";

Vue.use(Vuex);

const stringify = task => ({
  ...task,
  start: task.start.format(),
  end: task.end.format()
});

const parse = task => ({
  ...task,
  start: moment(task.start),
  end: moment(task.end)
});

export default {
  namespaced: true,
  state: {},
  getters: {
    [getAll]: state => Object.values(state).map(parse),
    [getByAssignee]: (state, getters) => assigneeId =>
      getters[getAll].filter(task => task.assignee === assigneeId)
  },
  mutations: {
    [add]: (state, task) => {
      task.id = generateNewId(Object.keys(state));
      Vue.set(state, task.id, stringify(task));
    },
    [edit]: (state, task) => {
      Vue.set(state, task.id, stringify(task));
    }
  }
};
