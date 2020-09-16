<template>
  <div
    class="lane"
    :style="laneCssVars"
    @mousedown.self="onMouseDown"
    @mouseup="onMouseUp"
    @mouseover="onMouseOver"
  >
    <NameTag
      :class="`lane__name-tag ${this.dragHandleClass}`"
      :assignee="assignee"
    ></NameTag>
    <slot></slot>
    <v-dialog v-model="dialog" max-width="400">
      <TaskForm :task="newTask" @submit="dialog = false" />
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import TaskForm from "@/components/tasks/TaskForm";
import { isAssignee } from "@/store/assignees/schema";
import NameTag from "@/components/assignees/NameTag";
import dates from "@/mixins/dates";
import { getScrollXOffset } from "@/store/calendar/types";
import { mapGetters } from "vuex";
import { modules } from "@/store";

export default {
  name: "Lane",
  components: {
    TaskForm,
    NameTag
  },
  props: {
    assignee: {
      type: Object,
      validator: isAssignee,
      required: true
    },
    height: {
      type: Number,
      default: 50,
      required: false
    },
    dragHandleClass: {
      type: String,
      default: "",
      required: false
    }
  },
  mixins: [dates],
  data() {
    return {
      newTaskDates: [null, null],
      newTask: {},
      dialog: false
    };
  },
  methods: {
    onMouseOver() {
      sessionStorage.setItem("assigneeID", this.assignee.id);
    },

    onMouseDown(e) {
      const startDay = this.getDayByPositionX(e.offsetX);
      this.newTaskDates = [startDay, startDay];
    },

    onMouseUp(e) {
      this.newTaskDates[1] = this.getDayByPositionX(e.offsetX);
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

    tasksOverlap(a, b) {
      const rangeA = moment.range(a.start, a.end);
      const rangeB = moment.range(b.start, b.end);
      return rangeA.overlaps(rangeB);
    }
  },
  computed: {
    ...mapGetters(modules.calendar, {
      scrollOffsetX: getScrollXOffset
    }),
    laneCssVars() {
      return {
        "--height": `${this.height}px`,
        "--scroll-offset-x": `${this.scrollOffsetX}px`
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
  height: calc(var(--height) + var(--padding-y));
  padding: var(--padding-top) 0 var(--padding-bottom) 0;
  background: rgba(0, 0, 0, 0.1);
  border-top: 2px solid rgba(0, 0, 0, 0.4);
  cursor: crosshair;

  &__name-tag {
    position: absolute;
    left: calc(var(--scroll-offset-x) + 10px);
    z-index: 1;
    cursor: grab;
  }
}
</style>
