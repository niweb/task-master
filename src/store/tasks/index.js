import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

import {
  add,
  addLink,
  edit,
  getAll,
  getByAssignee,
  remove,
  removeByAssignee,
  removeByProject,
  removeLink
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
// const selectOne = state => taskId => selectAll(state)[taskId];
const selectByAssignee = state => assigneeId =>
  selectAll(state).filter(task => task.assignee === assigneeId);
const selectByProject = state => projectId =>
  selectAll(state).filter(task => task.project === projectId);

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
      task.links = [];
      Vue.set(state, task.id, stringify(task));
    },
    [edit]: (state, task) => {
      Vue.set(state, task.id, stringify(task));
    },
    [addLink]: (state, { from, to }) => {
      const fromTask = state[from];
      const toIsValid = to !== null && to !== undefined;
      if (fromTask && toIsValid && !fromTask.links.includes(to)) {
        fromTask.links.push(to);
      }
    },
    [removeLink]: (state, { from, to }) => {
      //TODO
      console.log("remove", from, to);
    },
    [remove]: (state, taskId) => {
      Vue.delete(state, taskId);
    },
    [removeByAssignee]: (state, assigneeId) => {
      const tasks = selectByAssignee(state)(assigneeId);
      tasks.forEach(task => Vue.delete(state, task.id));
    },
    [removeByProject]: (state, assigneeId) => {
      const tasks = selectByProject(state)(assigneeId);
      tasks.forEach(task => Vue.delete(state, task.id));
    }
  }
};
