<template>
  <div class="scroll-wrapper">
    <div class="calendar">
      <div class="lanes">
        <Lane :dates="days" class="lane"></Lane>
        <Lane :dates="days" class="lane"></Lane>
        <Lane :dates="days" class="lane"></Lane>
      </div>
      <Day v-for="day in days" :key="day.format()" :date="day"></Day>
    </div>
  </div>
</template>

<script>
import Moment from "moment";
import { extendMoment } from "moment-range";
import Day from "@/components/timeline/Day";
import Lane from "@/components/timeline/Lane";

const moment = extendMoment(Moment);

export default {
  name: "Calendar",
  components: {
    Day,
    Lane
  },
  data() {
    const range = moment.range(
      moment().subtract(1.5, "weeks"),
      moment().add(3, "weeks")
    );
    return {
      today: moment(),
      days: Array.from(range.by("day", { excludeEnd: true }))
    };
  }
};
</script>

<style scoped lang="scss">
.scroll-wrapper {
  width: 100%;
  overflow: auto;
}

.calendar {
  position: relative;
  display: flex;
  flex-flow: row;
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
