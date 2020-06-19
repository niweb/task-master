<template>
  <div class="scroll-wrapper" @scroll="onScroll">
    <div class="calendar" :style="cssVars">
      <Draggable
        v-model="assignees"
        @start="dragging = true"
        @end="dragging = false"
        class="drag-wrapper"
        handle=".lane__name-tag"
      >
        <Lane
          v-for="(assignee, index) in assignees"
          class="lane"
          :style="`--index: ${index};`"
          :key="assignee.id"
          :assignee="assignee"
          :dates="days"
          :column-width="columnWidth"
          :scroll-offset-x="offsetX"
        >
          <NameTag class="lane__name-tag" :assignee="assignee"></NameTag>
        </Lane>
      </Draggable>
      <Day
        v-for="(day, index) in days"
        class="day"
        :style="`--index: ${index};`"
        :key="day.format()"
        :date="day"
      ></Day>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import { extendMoment } from "moment-range";
import Draggable from "vuedraggable";

import Day from "@/components/timeline/Day";
import Lane from "@/components/timeline/Lane";
import { getAll, set } from "@/store/assignees/types";
import { modules } from "@/store";
import NameTag from "@/components/assignees/NameTag";

const moment = extendMoment(Moment);

export default {
  name: "Calendar",
  components: {
    Day,
    Lane,
    Draggable,
    NameTag
  },
  computed: {
    assignees: {
      get() {
        return this.$store.getters[`${modules.assignees}/${getAll}`];
      },
      set(value) {
        this.$store.commit(`${modules.assignees}/${set}`, value);
      }
    },
    cssVars() {
      return {
        "--columns": this.days.length,
        "--column-width": `${this.columnWidth}px`,
        "--lanes": this.assignees.length,
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
      columnWidth: 50,
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

.calendar {
  --rows: calc(var(--lanes) + 2);
  height: 100%;
  display: grid;
  grid-template-columns: repeat(var(--columns), var(--column-width));
  grid-template-rows: [header] 60px [lanes] repeat(var(--lanes), auto) [remaining-space] 1fr;
}

.day {
  grid-row: 1 / span var(--rows);
  grid-column: calc(var(--index) + 1); // grid starts with 1
}

.drag-wrapper {
  display: contents;
}

.lane {
  z-index: 1;
  margin: 20px 0;
  grid-column: 1 / span var(--columns);
  grid-row: calc(var(--index) + 2); // grid starts with 1 + exclude header row

  &__name-tag {
    position: absolute;
    left: calc(var(--offset-x) + 10px);
    z-index: 1;
    cursor: grab;
  }
}
</style>
