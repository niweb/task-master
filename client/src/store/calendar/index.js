import Vue from "vue";
import Vuex from "vuex";
import {
  getDates,
  getPixelsPerDay,
  getScrollXOffset,
  setDates,
  setPixelsPerDay,
  setScrollXOffset
} from "@/store/calendar/types";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    pixelsPerDay: 40,
    scrollXOffset: 0,
    dates: []
  },
  getters: {
    [getPixelsPerDay]: state => state.pixelsPerDay,
    [getScrollXOffset]: state => state.scrollXOffset,
    [getDates]: state => state.dates
  },
  mutations: {
    [setPixelsPerDay]: (state, pixels) => {
      Vue.set(state, "pixelsPerDay", pixels);
    },
    [setScrollXOffset]: (state, offset) => {
      Vue.set(state, "scrollXOffset", offset);
    },
    [setDates]: (state, dates) => {
      Vue.set(state, "dates", dates);
    }
  }
};
