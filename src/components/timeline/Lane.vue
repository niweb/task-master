<template>
  <div class="lane" :style="laneCssVars">
    <div class="name">
      {{ assignee.name }}
    </div>
    <Task
      v-for="task in tasksByAssignee(assignee.id)"
      :style="getTaskCssVars(task)"
      :key="task.id"
      :task="task"
    ></Task>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { modules } from "@/store";
import { getByAssignee } from "@/store/tasks.types";
import Task from "@/components/timeline/Task";

export default {
  name: "Lane",
  components: {
    Task
  },
  props: {
    dates: Array /** Moment[] */,
    assignee: {
      type: Object,
      required: true
    }
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
    ...mapGetters(modules.tasks, { tasksByAssignee: getByAssignee }),
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
  border-top: 2px solid rgba(0, 0, 0, 0.4);

  .name {
    position: fixed;
    left: 10px;
    margin-top: -15px;
    background-color: white;
    padding: 2px 15px;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.4);
  }

  .task {
    grid-column: var(--start-col) / var(--end-col);
    margin: 2px 0;
    place-self: center stretch;
  }
}
</style>
