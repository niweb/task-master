import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

import {
  add,
  edit,
  getAll,
  getByAssignee,
  remove,
  removeByAssignee
} from "@/store/tasks/types";
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

const selectAll = state => Object.values(state).map(parse);
const selectByAssignee = state => assigneeId =>
  selectAll(state).filter(task => task.assignee === assigneeId);

export default {
  namespaced: true,
  state: {},
  getters: {
    [getAll]: selectAll,
    [getByAssignee]: selectByAssignee
  },
  mutations: {
    [add]: (state, task) => {
      task.id = generateNewId(Object.keys(state));
      Vue.set(state, task.id, stringify(task));
    },
    [edit]: (state, task) => {
      Vue.set(state, task.id, stringify(task));
    },
    [remove]: (state, taskId) => {
      Vue.delete(state, taskId);
    },
    [removeByAssignee]: (state, assigneeId) => {
      const tasks = selectByAssignee(state)(assigneeId);
      tasks.forEach(task => Vue.delete(state, task.id));
    }
  }
};
