<template>
  <div class="scroll-wrapper" @scroll="onScroll">
    <div class="calendar">
      <div class="lanes">
        <Lane
          v-for="assignee in assignees"
          :key="assignee.id"
          :assignee="assignee"
          :dates="days"
          :column-width="columnWidth"
          :scroll-offset-x="offsetX"
          class="lane"
        ></Lane>
      </div>
      <Day
        v-for="day in days"
        :key="day.format()"
        :date="day"
        :width="columnWidth"
      ></Day>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import { extendMoment } from "moment-range";
import { mapGetters } from "vuex";

import Day from "@/components/timeline/Day";
import Lane from "@/components/timeline/Lane";
import { getAll } from "@/store/assignees.types";
import { modules } from "@/store";

const moment = extendMoment(Moment);

export default {
  name: "Calendar",
  components: {
    Day,
    Lane
  },
  computed: {
    ...mapGetters(modules.assignees, {
      assignees: getAll
    })
  },
  methods: {
    onScroll(e) {
      this.offsetX = e.target.scrollLeft;
      const offsetRight = this.offsetX + e.target.clientWidth;
      const calendarWidth = this.days.length * this.columnWidth;
      if (calendarWidth <= offsetRight) {
        console.log("load more days");
      }
    }
  },
  data() {
    const range = moment.range(
      moment().subtract(1.5, "weeks"),
      moment().add(3, "weeks")
    );
    return {
      today: moment(),
      days: Array.from(range.by("day", { excludeEnd: true })),
      columnWidth: 50,
      offsetX: 0
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
  position: relative;
  display: flex;
  flex-flow: row;
  height: 100%;
}

.lanes {
  z-index: 1;
  position: absolute;
  top: 60px;

  .lane {
    margin: 20px 0;
  }
}
</style>
