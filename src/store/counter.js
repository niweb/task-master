import Vue from "vue";
import Vuex from "vuex";
import {
  asyncDecrease,
  asyncIncrease,
  decrease,
  getCount,
  increase
} from "@/store/counter.types";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    count: 0
  },
  getters: {
    [getCount]: state => state.count
  },
  mutations: {
    [increase]: state => state.count++,
    [decrease]: state => state.count--
  },
  actions: {
    [asyncIncrease]: context => {
      setTimeout(() => {
        context.commit(increase);
      }, 1000);
    },
    [asyncDecrease]: context => {
      setTimeout(() => {
        context.commit(decrease);
      }, 1000);
    }
  }
};
