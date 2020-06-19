<template>
  <div
    class="lane"
    :style="laneCssVars"
    @mousedown.self="onMouseDown"
    @mouseup="onMouseUp"
  >
    <slot />
    <template v-for="(taskLane, index) in sortedTasks">
      <Task
        v-for="task in taskLane"
        :key="task.id"
        :task="task"
        :top="index * taskHeight"
        :height="taskHeight"
        :first-day-in-calendar="dates[0]"
        :pixels-per-day="columnWidth"
      ></Task>
    </template>
    <v-dialog v-model="dialog" max-width="400">
      <TaskForm :task="newTask" @submit="dialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import { modules } from "@/store";
import { getByAssignee } from "@/store/tasks/types";
import Task from "@/components/timeline/Task";
import TaskForm from "@/components/tasks/TaskForm";
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
    }
  },
  data() {
    return {
      newTaskDates: [null, null],
      newTask: {},
      dialog: false,
      taskHeight: 30
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
      dates.sort((a, b) => a.diff(b));
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
    },

    tasksOverlap(a, b) {
      const rangeA = moment.range(a.start, a.end);
      const rangeB = moment.range(b.start, b.end);
      return rangeA.overlaps(rangeB);
    }
  },
  computed: {
    ...mapGetters(modules.tasks, { tasksByAssignee: getByAssignee }),
    sortedTasks() {
      const tasks = this.tasksByAssignee(this.assignee.id) || [];
      let lanes = [];
      tasks
        .slice()
        .sort((a, b) => a.start.diff(b.start))
        .forEach(task => {
          let sorted = false;
          let i = 0;
          while (!sorted) {
            if (lanes[i] == null) {
              lanes[i] = [task];
              sorted = true;
            } else if (
              lanes[i].every(sortedTask => !this.tasksOverlap(sortedTask, task))
            ) {
              lanes[i].push(task);
              sorted = true;
            } else {
              i++;
            }
          }
        });
      return lanes;
    },
    laneCssVars() {
      return {
        "--number-of-columns": this.dates.length,
        "--column-width": `${this.columnWidth}px`,
        "--task-lanes": this.sortedTasks.length,
        "--task-height": `${this.taskHeight}px`
      };
    }
  }
};
</script>

<style scoped lang="scss">
.lane {
  --padding-top: 5px;
  --padding-bottom: 25px;
  --padding-y: calc(var(--padding-top) + var(--padding-bottom));

  position: relative;
  width: 100%;
  min-height: 50px;
  height: calc(var(--task-lanes) * var(--task-height) + var(--padding-y));
  padding: var(--padding-top) 0 var(--padding-bottom) 0;
  background: rgba(0, 0, 0, 0.1);
  border-top: 2px solid rgba(0, 0, 0, 0.4);
  cursor: crosshair;

  .task {
    position: absolute;
    margin: 2px 0;
  }
}
</style>
