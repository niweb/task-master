<template>
  <VueDraggableResizable
    :prevent-deactivation="true"
    :handles="['mr', 'ml']"
    :axis="'x'"
    :grid="[pixelsPerDay, height]"
    :x="left"
    :y="top"
    :w="width"
    :h="height - marginY * 2"
    :minWidth="pixelsPerDay"
    @resizestop="onResize"
    @dragstop="onDrag"
    :onDragStart="onDragStart"
    class-name-handle="task__handle"
    class="task"
    :style="cssVars"
  >
    <div class="task__content">
      <span class="task__title">{{ task.title }}</span>
      <v-btn
        x-small
        icon
        color="white"
        class="task__edit-btn"
        @click.stop="dialog = true"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        x-small
        icon
        color="white"
        class="task__delete-btn"
        @click="deleteTask(task.id)"
      >
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <TaskForm :task="task" @submit="dialog = false"></TaskForm>
    </v-dialog>
  </VueDraggableResizable>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
import { mapMutations } from "vuex";
import moment from "moment";

import TaskForm from "@/components/tasks/TaskForm";
import { isTask } from "@/store/tasks/schema";
import { modules } from "@/store";
import { edit, remove } from "@/store/tasks/types";

export default {
  name: "Task",
  props: {
    task: {
      type: Object,
      validator: isTask
    },
    top: {
      type: Number,
      required: false,
      default: 0
    },
    height: {
      type: Number,
      required: false,
      default: 30
    },
    firstDayInCalendar: {
      type: moment,
      required: true
    },
    pixelsPerDay: {
      type: Number,
      required: false,
      default: 50
    }
  },
  components: {
    TaskForm,
    VueDraggableResizable
  },
  data() {
    return {
      dialog: false,
      dragging: false,
      marginY: 1
    };
  },
  computed: {
    left() {
      return this.getSpaceBetween(this.firstDayInCalendar, this.task.start);
    },
    width() {
      return (
        this.getSpaceBetween(this.task.start, this.task.end) + this.pixelsPerDay //fill column for end day
      );
    },
    cssVars() {
      return { "--drag-cursor": this.dragging ? "grabbing" : "grab" };
    }
  },
  methods: {
    ...mapMutations(modules.tasks, { editTask: edit, deleteTask: remove }),
    getSpaceBetween(start, end) {
      return end.diff(start, "d") * this.pixelsPerDay;
    },
    getDayAfter(start, pixels) {
      return moment(start).add(pixels / this.pixelsPerDay, "d");
    },
    onResize(x, y, width) {
      this.updateTask(x, width);
    },
    onDrag(x) {
      this.updateTask(x, this.width);
      this.dragging = false;
    },
    onDragStart() {
      this.dragging = true;
    },
    updateTask(x, width) {
      if (x !== this.left || width !== this.width) {
        const start = this.getDayAfter(this.firstDayInCalendar, x).startOf("d");
        const end = this.getDayAfter(start, width)
          .subtract(1, "d")
          .endOf("d");
        this.editTask({ ...this.task, start, end });
      }
    }
  }
};
</script>

<style lang="scss">
.task {
  background-color: #2c3e50;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  display: flex;

  &__content {
    cursor: var(--drag-cursor);
    flex: 1 1 auto;
    padding: 2px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    align-self: stretch;

    display: flex;
    align-items: center;
  }

  &__title {
    flex-shrink: 1;
    margin-right: auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__handle {
    display: block !important;
    flex-shrink: 0;
    background-color: rgba(255, 255, 255, 0.2);
    height: 100%;
    width: 5px;

    &-ml {
      cursor: ew-resize;
    }

    &-mr {
      order: 1;
      cursor: ew-resize;
    }
  }
}
</style>
