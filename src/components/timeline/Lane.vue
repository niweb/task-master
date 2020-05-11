<template>
  <div class="lane" :style="laneCssVars">
    <Task
      v-for="task in tasks"
      :style="getTaskCssVars(task)"
      :key="task.id"
      :task="task"
    ></Task>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { modules } from "@/store";
import { getAll } from "@/store/tasks.types";
import Task from "@/components/timeline/Task";

export default {
  name: "Lane",
  components: {
    Task
  },
  props: {
    dates: Array /** Moment[] */
  },
  methods: {
    getTaskCssVars(task) {
      return {
        "--start-col": this.getDistanceToFirstDate(task.start) + 1, // +1: grid system starts with 1
        "--end-col": this.getDistanceToFirstDate(task.end) + 1
      };
    },
    getDistanceToFirstDate(day) {
      return day.diff(this.dates[0], "day") + 1; // +1: include start day
    }
  },
  computed: {
    ...mapGetters(modules.tasks, { tasks: getAll }),
    laneCssVars() {
      return {
        "--number-of-columns": this.dates.length
      };
    }
  }
};
</script>

<style scoped lang="scss">
.lane {
  display: grid;
  width: 100%;
  min-height: 50px;
  padding: 5px 0;
  grid-template-columns: repeat(var(--number-of-columns), 50px);
  grid-template-rows: auto;
  background: rgba(0, 0, 0, 0.1);

  .task {
    grid-column: var(--start-col) / var(--end-col);
    margin: 2px 0;
  }
}
</style>
