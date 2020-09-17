<template>
  <div class="scroll-wrapper" @scroll="onScroll">
    <div class="calendar" :style="cssVars">
      <div class="content">
        <slot></slot>
      </div>
      <div
        class="month"
        v-for="(count, month) in months"
        :key="month"
        :style="{ '--span-days': count }"
      >
        {{ month }}
      </div>
      <Day
        v-for="(day, index) in dates"
        :key="day.format()"
        class="day"
        :style="`--index: ${index};`"
        :date="day"
        :minimal="columnWidth <= 40"
      ></Day>
    </div>
    <ZoomControls
      class="zoom-controls"
      @zoom="onZoom"
      :can-zoom-in="columnWidth < 200"
      :can-zoom-out="columnWidth > 30"
      @jumpToToday="scrollToToday"
    >
    </ZoomControls>
  </div>
</template>

<script>
import moment from "moment";
import Day from "@/components/timeline/Day";
import ZoomControls from "@/components/timeline/ZoomControls";
import dates from "@/mixins/dates";
import { mapGetters, mapMutations } from "vuex";
import { modules } from "@/store";
import {
  getDates,
  getPixelsPerDay,
  getScrollXOffset,
  setDates,
  setPixelsPerDay,
  setScrollXOffset
} from "@/store/calendar/types";

export default {
  name: "Calendar",
  components: {
    Day,
    ZoomControls
  },
  mixins: [dates],
  computed: {
    ...mapGetters(modules.calendar, {
      columnWidth: getPixelsPerDay,
      offsetX: getScrollXOffset,
      dates: getDates
    }),
    months() {
      return this.dates
        .map(d => d.format("MMMM YYYY"))
        .reduce((acc, curr) => {
          const currentCount = acc[curr] || 0;
          acc[curr] = currentCount + 1;
          return acc;
        }, {});
    },
    cssVars() {
      return {
        "--columns": this.dates.length,
        "--column-width": `${this.columnWidth}px`,
        "--offset-x": `${this.offsetX}px`
      };
    }
  },
  methods: {
    ...mapMutations(modules.calendar, {
      setPixelsPerDay: setPixelsPerDay,
      setOffsetX: setScrollXOffset,
      setDates: setDates
    }),

    onScroll(e) {
      const offsetLeft = e.target.scrollLeft;
      this.setOffsetX(offsetLeft);
      const offsetRight = offsetLeft + e.target.clientWidth;
      const calendarWidth = this.dates.length * this.columnWidth;
      if (calendarWidth <= offsetRight) {
        this.loadFutureDays();
      } else if (offsetLeft <= 0) {
        this.loadPastDays();
      }
    },

    loadFutureDays() {
      const lastDay = this.dates[this.dates.length - 1];
      const newDays = this.getBusinessDaysBetween(
        moment(lastDay).add(1, "d"),
        moment(lastDay).add(6, "w")
      );
      this.setDates([...this.dates, ...newDays]);
    },

    loadPastDays() {
      const firstDay = this.dates[0];
      const newDays = this.getBusinessDaysBetween(
        moment(firstDay).subtract(6, "w"),
        moment(firstDay).subtract(1, "d")
      );
      this.setDates([...newDays, ...this.dates]);
      this.$el.scrollTo(newDays.length * this.columnWidth, 0);
    },

    loadInitialDays() {
      const initialDays = this.getBusinessDaysBetween(
        moment().subtract(3, "weeks"),
        moment().add(6, "weeks")
      );
      this.setDates(initialDays);
    },

    scrollToDate(day) {
      const calendarWidth = this.$el.clientWidth;
      const positionOfToday = this.getPositionOfDay(day);
      this.$el.scrollTo(positionOfToday - calendarWidth / 3, 0);
    },

    onZoom(level) {
      const daysOutsideViewport = this.offsetX / this.columnWidth;
      const zoomFactor = (this.columnWidth ^ 2) / 2;
      const newColumnWidth = this.columnWidth + level * zoomFactor;
      this.setPixelsPerDay(newColumnWidth);
      this.$el.scrollTo(daysOutsideViewport * newColumnWidth, 0);
    },
    scrollToToday() {
      this.scrollToDate(moment());
    }
  },
  created() {
    this.loadInitialDays();
  },
  mounted() {
    this.scrollToToday();
  }
};
</script>

<style scoped lang="scss">
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.zoom-controls {
  position: absolute;
  bottom: 30px;
  right: 30px;
}

.calendar {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(var(--columns), var(--column-width));
  grid-template-rows: [months] auto [days] 60px [content] auto [remaining-space] 1fr;
}

.month {
  grid-row: months;
  grid-column: span var(--span-days);
  padding: 0 10px 10px;
  color: #999999;
  margin-left: -1px;
  border-left: 1px solid #efefef;
  white-space: nowrap;
}

.day {
  grid-row: days / span 3;
  grid-column: calc(var(--index) + 1); // grid starts with 1
}

.content {
  z-index: 1;
  margin: 20px 0;
  grid-column: 1 / span var(--columns);
  grid-row: content;
}
</style>
