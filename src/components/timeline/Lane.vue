<template>
  <div
    class="lane"
    :style="laneCssVars"
    @mousedown.self="onMouseDown"
    @mouseup="onMouseUp"
  >
    <div class="name">
      {{ assignee.name }}
    </div>
    <Task
      v-for="task in tasksByAssignee(assignee.id)"
      :key="task.id"
      :task="task"
      :first-day-in-calendar="dates[0]"
      :pixels-per-day="columnWidth"
    ></Task>
    <v-dialog v-model="dialog" max-width="400">
      <TaskForm :task="newTask" @submit="dialog = false"></TaskForm>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { modules } from "@/store";
import { getByAssignee } from "@/store/tasks/types";
import Task from "@/components/timeline/Task";
import TaskForm from "@/components/task-form/TaskForm";
import { isAssignee } from "@/store/assignees/schema";

export default {
  name: "Lane",
  components: {
    Task,
    TaskForm
  },
  props: {
    dates: {
      type: Array,
      validator: prop => prop.every(e => e instanceof moment)
    },
    assignee: {
      type: Object,
      validator: isAssignee,
      required: true
    },
    columnWidth: {
      type: Number,
      default: 50,
      required: false
    },
    scrollOffsetX: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      newTaskDates: [null, null],
      newTask: {},
      dialog: false
    };
  },
  methods: {
    onMouseDown(e) {
      const startDay = this.getDayByOffset(e.offsetX);
      this.newTaskDates = [startDay, startDay];
    },

    onMouseUp(e) {
      this.newTaskDates[1] = this.getDayByOffset(e.offsetX);
      if (!this.newTaskDates.includes(null)) {
        this.createNewTask();
      }
      this.newTaskDates = [null, null]; // reset
    },

    createNewTask() {
      const dates = this.newTaskDates;
      dates.sort((a, b) => a.format("YYYYMMDD") - b.format("YYYYMMDD"));
      this.newTask = {
        assignee: this.assignee.id,
        start: dates[0],
        end: dates[1]
      };
      this.dialog = true;
    },

    getDayByOffset(offset) {
      const index = Math.floor(offset / this.columnWidth);
      return this.dates[index];
    }
  },
  computed: {
    ...mapGetters(modules.tasks, { tasksByAssignee: getByAssignee }),
    laneCssVars() {
      return {
        "--number-of-columns": this.dates.length,
        "--column-width": `${this.columnWidth}px`,
        "--offset-x": `${this.scrollOffsetX}px`
      };
    }
  }
};
</script>

<style scoped lang="scss">
.lane {
  position: relative;
  width: 100%;
  min-height: 50px;
  padding: 5px 0 15px 0;
  background: rgba(0, 0, 0, 0.1);
  border-top: 2px solid rgba(0, 0, 0, 0.4);
  cursor: crosshair;

  .name {
    position: absolute;
    left: calc(var(--offset-x) + 10px);
    z-index: 1;
    margin-top: -15px;
    background-color: white;
    padding: 2px 15px;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.4);
  }

  .task {
    position: absolute;
    margin: 2px 0;
  }
}
</style>
