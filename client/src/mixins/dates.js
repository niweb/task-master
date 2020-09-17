import { mapGetters } from "vuex";
import { modules } from "@/store";
import { getDates, getPixelsPerDay } from "@/store/calendar/types";
import { getBusinessDaysBetween } from "@/utils";

export default {
  computed: {
    ...mapGetters(modules.calendar, {
      pixelsPerDay: getPixelsPerDay,
      dates: getDates
    }),

    firstDayInCalendar() {
      return this.dates[0];
    }
  },

  methods: {
    getBusinessDaysBetween(start, end) {
      return getBusinessDaysBetween(start, end);
    },

    getDayByPositionX(positionX) {
      const index = Math.floor(positionX / this.pixelsPerDay);
      return this.dates[index];
    },

    getPositionOfDay(day) {
      return this.getSpaceBetweenDays(this.firstDayInCalendar, day);
    },

    getSpaceBetweenDays(start, end, includeEndDay = false) {
      const daysBetween = this.getBusinessDaysBetween(start, end).length;
      const adjustedDaysBetween = includeEndDay ? daysBetween : daysBetween - 1;
      return adjustedDaysBetween * this.pixelsPerDay;
    }
  }
};
