import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

import { add, edit, getAll, getByAssignee } from "@/store/tasks.types";
import { generateNewId } from "@/utils";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    3: {
      id: 3,
      title: "Foo",
      assignee: 0,
      start: moment().startOf("day"),
      end: moment()
        .add(4, "days")
        .endOf("day")
    },
    4: {
      id: 4,
      title: "Bar",
      assignee: 1,
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
      assignee: 0,
      start: moment()
        .add(3, "days")
        .startOf("day"),
      end: moment()
        .add(12, "days")
        .endOf("day")
    }
  },
  getters: {
    [getAll]: state => Object.values(state),
    [getByAssignee]: (state, getters) => assigneeId =>
      getters[getAll].filter(task => task.assignee === assigneeId)
  },
  mutations: {
    [add]: (state, task) => {
      task.id = generateNewId(Object.keys(state));
      Vue.set(state, task.id, task);
    },
    [edit]: (state, task) => {
      Vue.set(state, task.id, task);
    }
  }
};
