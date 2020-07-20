import Vue from "vue";
import Vuex from "vuex";

import { add, getAll, edit, set, remove } from "@/store/assignees/types";
import { generateNewId } from "@/utils";
import { modules } from "@/store";
import { removeByAssignee } from "@/store/tasks/types";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: [{ id: 0, name: "Default" }],
  getters: {
    [getAll]: state => state
  },
  mutations: {
    [set]: (state, list) => {
      state.splice(0);
      state.push(...list);
    },
    [add]: (state, assignee) => {
      assignee.id = generateNewId(state.map(p => p.id));
      state.push(assignee);
    },
    [edit]: (state, assignee) => {
      const i = state.findIndex(a => a.id === assignee.id);
      Vue.set(state, i, assignee);
    }
  },
  actions: {
    [remove]({ state, dispatch }, assigneeId) {
      const i = state.findIndex(a => a.id === assigneeId);
      dispatch(`${modules.tasks}/${removeByAssignee}`, assigneeId, {
        root: true
      });
      Vue.delete(state, i);
    }
  }
};
