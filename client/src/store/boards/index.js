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
  requestTypes
} from "./types";
import router from "../../router";
import paths, { buildPath } from "../../router/paths";

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
    [getRequestInProgress]: state => state.requestInProgress
  },
  mutations: {
    [setCurrentBoardId]: (state, id) => Vue.set(state, "id", id),
    [setRequestInProgress]: (state, isRequesting) =>
      Vue.set(state, "requestInProgress", isRequesting)
  },
  actions: {
    [create]({ commit }) {
      const newBoardId = uuid();
      commit(setRequestInProgress, requestTypes.create);
      fetch(`api/boards.php?id=${newBoardId}`, {
        method: "post",
        body: JSON.stringify({ foo: "bar" })
      })
        .then(response => response.json())
        .then(content => {
          console.log("response post", content);
          commit(setCurrentBoardId, newBoardId);
          commit(setRequestInProgress, null);
          router.push(buildPath(paths.timeline, { id: newBoardId })).then();
        });
    },
    [load]({ getters, commit }, boardId) {
      commit(setRequestInProgress, requestTypes.load);
      if (boardId) {
        commit(setCurrentBoardId, boardId);
      }
      fetch(`api/boards.php?id=${getters[getCurrentBoardId]}`)
        .then(response => response.json())
        .then(response => {
          console.log("response get", response);
          commit(setRequestInProgress, null);
          router
            .push(buildPath(paths.timeline, { id: getters[getCurrentBoardId] }))
            .then();
        });
    },
    [save]({ getters, commit }) {
      commit(setRequestInProgress, requestTypes.save);
      fetch(`api/boards.php?id=${getters[getCurrentBoardId]}`, {
        method: "put",
        body: JSON.stringify({ foo: "bar" })
      })
        .then(response => response.json())
        .then(response => {
          console.log("response put", response);
          commit(setRequestInProgress, null);
        });
    },
    [remove]({ getters, commit }) {
      commit(setRequestInProgress, requestTypes.remove);
      fetch(`api/boards.php?id=${getters[getCurrentBoardId]}`, {
        method: "delete",
        body: JSON.stringify({ foo: "bar" })
      })
        .then(response => response.json())
        .then(response => {
          console.log("response delete", response);
          commit(setCurrentBoardId, null);
          commit(setRequestInProgress, null);
          router.push(paths.index).then();
        });
    }
  }
};
