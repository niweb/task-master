<template>
  <div class="scroll-wrapper" @scroll="onScroll">
    <div class="calendar" :style="cssVars">
      <div class="content">
        <slot :scrollOffsetX="offsetX" :dates="days"></slot>
      </div>
      <Day
        v-for="(day, index) in days"
        class="day"
        :style="`--index: ${index};`"
        :key="day.format()"
        :date="day"
        :minimal="columnWidth <= 40"
      ></Day>
    </div>
    <ZoomControls
      class="zoom-controls"
      @zoom="onZoom"
      :can-zoom-in="columnWidth < 200"
      :can-zoom-out="columnWidth > 30"
    >
    </ZoomControls>
  </div>
</template>

<script>
import Moment from "moment";
import { extendMoment } from "moment-range";
import Day from "@/components/timeline/Day";
import ZoomControls from "@/components/timeline/ZoomControls";

const moment = extendMoment(Moment);

export default {
  name: "Calendar",
  components: {
    Day,
    ZoomControls
  },
  computed: {
    cssVars() {
      return {
        "--columns": this.days.length,
        "--column-width": `${this.columnWidth}px`,
        "--offset-x": `${this.offsetX}px`
      };
    }
  },
  methods: {
    onScroll(e) {
      this.offsetX = e.target.scrollLeft;
      const offsetRight = this.offsetX + e.target.clientWidth;
      const calendarWidth = this.days.length * this.columnWidth;
      if (calendarWidth <= offsetRight) {
        this.loadFutureDays();
      } else if (this.offsetX <= 0) {
        this.loadPastDays();
      }
    },
    loadFutureDays() {
      const lastDay = this.days[this.days.length - 1];
      const range = moment
        .range(moment(lastDay).add(1, "d"), moment(lastDay).add(6, "w"))
        .by("day");
      const newDays = Array.from(range).map(d => d.startOf("d"));
      this.days = [...this.days, ...newDays];
    },
    loadPastDays() {
      const firstDay = this.days[0];
      const range = moment
        .range(
          moment(firstDay).subtract(6, "w"),
          moment(firstDay).subtract(1, "d")
        )
        .by("day");
      const newDays = Array.from(range).map(d => d.startOf("d"));
      this.days = [...newDays, ...this.days];
      this.$el.scrollTo(newDays.length * this.columnWidth, 0);
    },
    onZoom(level) {
      const daysOutsideViewport = this.offsetX / this.columnWidth;
      const zoomFactor = (this.columnWidth ^ 2) / 2;
      this.columnWidth += level * zoomFactor;
      this.$el.scrollTo(daysOutsideViewport * this.columnWidth, 0);
    }
  },
  mounted() {
    const today = moment();
    const indexOfToday = this.days.findIndex(day => day.isSame(today, "d"));
    const calendarWidth = this.$el.clientWidth;
    this.$el.scrollTo(indexOfToday * this.columnWidth - calendarWidth / 3, 0);
  },
  data() {
    const range = moment
      .range(moment().subtract(3, "weeks"), moment().add(6, "weeks"))
      .by("day");
    return {
      days: Array.from(range).map(d => d.startOf("d")),
      columnWidth: 40,
      offsetX: 0,
      dragging: false
    };
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
  grid-template-rows: [header] 60px [content] auto [remaining-space] 1fr;
}

.day {
  grid-row: 1 / span 3;
  grid-column: calc(var(--index) + 1); // grid starts with 1
}

.content {
  z-index: 1;
  margin: 20px 0;
  grid-column: 1 / span var(--columns);
  grid-row: 2;
}
</style>
