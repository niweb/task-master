import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

import { add, getAll } from "@/store/tasks.types";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    3: {
      id: 3,
      title: "Foo",
      start: moment().startOf("day"),
      end: moment()
        .add(3, "days")
        .endOf("day")
    },
    4: {
      id: 4,
      title: "Bar",
      start: moment()
        .subtract(6, "days")
        .startOf("day"),
      end: moment()
        .add(1, "days")
        .endOf("day")
    },
    6: {
      id: 6,
      title: "Baz",
      start: moment()
        .add(4, "days")
        .startOf("day"),
      end: moment()
        .add(12, "days")
        .endOf("day")
    }
  },
  getters: {
    [getAll]: state => Object.values(state)
  },
  mutations: {
    [add]: (state, task) => {
      const ids = Object.keys(state).map(id => +id);
      const maxId = Math.max(ids) || 0;
      task.id = maxId + 1;
      Vue.set(state, task.id, task);
    }
  }
};
