import Vue from "vue";
import Vuex from "vuex";
import { getLinkingTask, setLinkingTask } from "@/store/ui/types";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    linkingTask: null
  },
  getters: {
    [getLinkingTask]: state => state.linkingTask
  },
  mutations: {
    [setLinkingTask]: (state, taskId) => {
      Vue.set(state, "linkingTask", taskId);
    }
  }
};
