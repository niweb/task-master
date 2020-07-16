<template>
  <div class="planner">
    <Draggable v-model="assignees" handle=".lane__drag-handle">
      <Lane
        v-for="assignee in assignees"
        class="lane"
        drag-handle-class="lane__drag-handle"
        :key="assignee.id"
        :assignee="assignee"
        :dates="dates"
        :scroll-offset-x="scrollOffsetX"
        :height="laneHeight[assignee.id]"
      >
        <template v-for="(taskLane, index) in sortedTasks[assignee.id]">
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
      </Lane>
      <Links class="links"></Links>
    </Draggable>
  </div>
</template>

<script>
import Moment from "moment";
import { extendMoment } from "moment-range";

import { mapGetters } from "vuex";
import Draggable from "vuedraggable";

import Lane from "@/components/timeline/Lane";
import Task from "@/components/timeline/Task";
import Links from "@/components/timeline/Links";

import { modules } from "@/store";
import { getAll, set } from "@/store/assignees/types";
import { getByAssignee } from "@/store/tasks/types";

const moment = extendMoment(Moment);

export default {
  name: "Planner",
  components: {
    Lane,
    Draggable,
    Task,
    Links
  },
  props: {
    scrollOffsetX: {
      type: Number,
      required: true
    },
    dates: {
      type: Array,
      validator: prop => prop.every(e => e instanceof moment)
    }
  },
  computed: {
    ...mapGetters(modules.tasks, { tasksByAssignee: getByAssignee }),
    assignees: {
      get() {
        return this.$store.getters[`${modules.assignees}/${getAll}`];
      },
      set(value) {
        this.$store.commit(`${modules.assignees}/${set}`, value);
      }
    },
    sortedTasks() {
      let tasks = {};
      this.assignees.forEach(a => (tasks[a.id] = this.sortTasks(a.id)));
      return tasks;
    },
    laneHeight() {
      const heights = {};
      this.assignees.forEach(
        a => (heights[a.id] = this.sortedTasks[a.id].length * this.taskHeight)
      );
      return heights;
    }
  },
  methods: {
    tasksOverlap(a, b) {
      const rangeA = moment.range(a.start, a.end);
      const rangeB = moment.range(b.start, b.end);
      return rangeA.overlaps(rangeB);
    },

    sortTasks(assigneeId) {
      const tasks = this.tasksByAssignee(assigneeId) || [];
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
    }
  },
  data() {
    return {
      columnWidth: 50,
      taskHeight: 30
    };
  }
};
</script>

<style scoped lang="scss">
.planner {
  position: relative;
}

.lane {
  margin-bottom: 30px;
}

.task {
  position: absolute;
}

.links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
