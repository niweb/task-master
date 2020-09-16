import Vue from "vue";
import Vuex from "vuex";

import {
  add,
  getAll,
  edit,
  set,
  remove,
  resetState,
  setState,
  select,
  getSelected,
  getById
} from "@/store/projects/types";
import { generateNewId } from "@/utils";
import { modules } from "@/store";
import { removeByProject } from "@/store/tasks/types";

Vue.use(Vuex);

const initialState = () => ({
  selected: 0,
  items: [{ id: 0, name: "Default", color: "#2c3e50" }]
});

export default {
  namespaced: true,
  state: initialState,
  getters: {
    [getAll]: state => state.items,
    [getSelected]: state => state.selected,
    [getById]: state => id => state.items.find(p => p.id === id)
  },
  mutations: {
    [set]: (state, list) => {
      state.items.splice(0);
      state.items.push(...list);
    },
    [setState]: (state, newState) => {
      Object.assign(state, newState);
    },
    [resetState]: state => {
      Object.assign(state, initialState());
    },
    [add]: (state, project) => {
      project.id = generateNewId(state.items.map(p => p.id));
      state.items.push(project);
    },
    [edit]: (state, project) => {
      const i = state.items.findIndex(a => a.id === project.id);
      Vue.set(state.items, i, project);
    },
    [select](state, projectId) {
      state.selected = projectId;
    }
  },
  actions: {
    [remove]({ state, dispatch }, projectId) {
      const i = state.items.findIndex(a => a.id === projectId);
      dispatch(`${modules.tasks}/${removeByProject}`, projectId, {
        root: true
      });
      Vue.delete(state.items, i);
      if ((state.selected = projectId)) {
        state.selected = state.items[0]?.id;
      }
    }
  }
};
