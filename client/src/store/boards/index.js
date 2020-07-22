import Vue from "vue";
import Vuex from "vuex";
import { v4 as uuid } from "uuid";

import {
  getCurrentBoardId,
  setCurrentBoardId,
  create,
  load,
  save,
  remove,
  setRequestInProgress,
  getRequestInProgress,
  requestTypes,
  internalRequest,
  getExportData,
  importData,
  resetData
} from "./types";
import { modules } from "../index";

import { setAll as setTasks, resetAll as resetTasks } from "../tasks/types";
import {
  set as setAssignees,
  reset as resetAssignees
} from "../assignees/types";
import {
  setState as setProjects,
  resetState as resetProjects
} from "../projects/types";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    id: null,
    needsSave: false,
    requestInProgress: false
  },
  getters: {
    [getCurrentBoardId]: state => state.id,
    [getRequestInProgress]: state => state.requestInProgress,
    [getExportData](state, getters, rootState) {
      return {
        version: "0.0.1",
        id: state.id,
        [modules.tasks]: rootState[modules.tasks],
        [modules.assignees]: rootState[modules.assignees],
        [modules.projects]: rootState[modules.projects]
      };
    }
  },
  mutations: {
    [setCurrentBoardId]: (state, id) => Vue.set(state, "id", id),
    [setRequestInProgress]: (state, isRequesting) =>
      Vue.set(state, "requestInProgress", isRequesting)
  },
  actions: {
    async [internalRequest](
      { commit, getters },
      { requestType, method, body, params }
    ) {
      commit(setRequestInProgress, requestType);
      const id = params?.id || getters[getCurrentBoardId];
      const endpoint = `api/boards.php?id=${id}`;
      const response = await fetch(endpoint, {
        method,
        ...(body && { body: JSON.stringify(body) })
      });
      const payload = await response.json();
      commit(setRequestInProgress, null);
      return payload;
    },
    async [create]({ dispatch, getters }) {
      const newBoardId = uuid();
      dispatch(resetData);
      await dispatch(internalRequest, {
        requestType: requestTypes.create,
        method: "post",
        params: { id: newBoardId },
        body: { ...getters[getExportData], id: newBoardId }
      });
      return newBoardId;
    },
    async [load]({ dispatch }) {
      const data = await dispatch(internalRequest, {
        requestType: requestTypes.load,
        method: "get"
      });
      dispatch(importData, data);
      return data;
    },
    async [save]({ dispatch, getters }) {
      return await dispatch(internalRequest, {
        requestType: requestTypes.save,
        method: "put",
        body: getters[getExportData]
      });
    },
    async [remove]({ dispatch }) {
      await dispatch(internalRequest, {
        requestType: requestTypes.remove,
        method: "delete"
      });
      dispatch(resetData);
    },
    [importData]({ commit }, data) {
      commit(`${modules.tasks}/${setTasks}`, data[modules.tasks], {
        root: true
      });
      commit(`${modules.assignees}/${setAssignees}`, data[modules.assignees], {
        root: true
      });
      commit(`${modules.projects}/${setProjects}`, data[modules.projects], {
        root: true
      });
    },
    [resetData]({ commit }) {
      commit(`${modules.tasks}/${resetTasks}`, null, { root: true });
      commit(`${modules.assignees}/${resetAssignees}`, null, { root: true });
      commit(`${modules.projects}/${resetProjects}`, null, { root: true });
    }
  }
};
