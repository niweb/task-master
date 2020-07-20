import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

import {
  add,
  addLink,
  update,
  getAll,
  getByAssignee,
  getLinks,
  getLinksFromTask,
  getOne,
  internalRemoveSingle,
  remove,
  removeByAssignee,
  removeByProject,
  removeLink,
  internalUpdateSingle,
  getLinksToTask,
  getByProject
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
const selectOne = state => taskId =>
  selectAll(state).find(t => t.id === taskId);
const selectByAssignee = state => assigneeId =>
  selectAll(state).filter(task => task.assignee === assigneeId);
const selectByProject = state => projectId =>
  selectAll(state).filter(task => task.project === projectId);

export default {
  namespaced: true,
  state: {},
  getters: {
    [getAll]: selectAll,
    [getByAssignee]: selectByAssignee,
    [getByProject]: selectByProject,
    [getOne]: selectOne,
    [getLinks]: state => {
      const linkTuples = [];
      selectAll(state).forEach(task => {
        task.links.forEach(link => {
          linkTuples.push({
            from: task.id,
            to: link
          });
        });
      });
      return linkTuples;
    },
    [getLinksFromTask]: (state, getters) => taskId => {
      const task = getters[getOne](taskId);
      return task.links;
    },
    [getLinksToTask]: (state, getters) => taskId => {
      return getters[getAll].filter(t => t.links.includes(taskId));
    }
  },
  mutations: {
    [add]: (state, task) => {
      task.id = generateNewId(Object.keys(state));
      task.links = [];
      Vue.set(state, task.id, stringify(task));
    },
    [internalUpdateSingle]: (state, task) => {
      Vue.set(state, task.id, stringify(task));
    },
    [removeLink]: (state, { from, to }) => {
      const newLinks = state[from].links.filter(link => link !== to);
      Vue.set(state[from], "links", newLinks);
    },
    [internalRemoveSingle]: (state, taskId) => {
      Vue.delete(state, taskId);
    }
  },
  actions: {
    [remove]: ({ commit, getters }, taskId) => {
      commit(internalRemoveSingle, taskId);
      getters[getLinksToTask](taskId)
        .map(t => t.id)
        .forEach(from => {
          commit(removeLink, { from, to: taskId });
        });
    },
    [removeByAssignee]: ({ getters, dispatch }, assigneeId) => {
      getters[getByAssignee](assigneeId).forEach(task =>
        dispatch(remove, task.id)
      );
    },
    [removeByProject]: ({ getters, dispatch }, assigneeId) => {
      getters[getByProject](assigneeId).forEach(task =>
        dispatch(remove, task.id)
      );
    },
    [update]: ({ commit, dispatch, getters }, task) => {
      commit(internalUpdateSingle, task);

      const linksFromThisTask = task.links.map(getters[getOne]);
      linksFromThisTask.forEach(linkedTask => {
        if (linkedTask.start.isBefore(task.end)) {
          const daysBetween = linkedTask.end.diff(linkedTask.start, "d");
          const start = task.end
            .clone()
            .add(1, "d")
            .startOf("d");
          const end = start
            .clone()
            .add(daysBetween, "d")
            .endOf("d");

          dispatch(update, {
            ...linkedTask,
            start,
            end
          });
        }
      });

      const linksToThisTask = getters[getLinksToTask](task.id);
      linksToThisTask.forEach(linkedTask => {
        if (linkedTask.end.isAfter(task.start)) {
          const daysBetween = linkedTask.end.diff(linkedTask.start, "d");
          const end = task.start
            .clone()
            .subtract(1, "d")
            .endOf("d");
          const start = end
            .clone()
            .subtract(daysBetween, "d")
            .startOf("d");

          dispatch(update, {
            ...linkedTask,
            start,
            end
          });
        }
      });
    },
    [addLink]: ({ dispatch, getters }, { from, to }) => {
      const fromTask = getters[getOne](from);
      const toIsValid = to !== null && to !== undefined;
      if (fromTask && toIsValid && !fromTask.links.includes(to)) {
        dispatch(update, {
          ...fromTask,
          links: [...fromTask.links, to]
        });
      }
    }
  }
};
