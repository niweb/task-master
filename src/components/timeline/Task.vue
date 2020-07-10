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
    class-name-handle="task__resize-handle"
    drag-handle=".task__drag-area"
    class="task"
    :style="cssVars"
  >
    <div class="task__content">
      <v-btn
        v-if="linkingTask !== null && linkingTask !== task.id"
        x-small
        icon
        :color="this.contrastColor"
        class="task__link-btn mr-1"
        @click="linkEnd"
      >
        <v-icon>mdi-link-plus</v-icon>
      </v-btn>

      <div class="task__drag-area">
        <span class="task__title">{{ task.title }}</span>
      </div>

      <v-btn
        x-small
        icon
        :color="this.contrastColor"
        class="task__edit-btn"
        @click.stop="dialog = true"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        x-small
        icon
        :color="this.contrastColor"
        class="task__delete-btn"
        @click="deleteTask(task.id)"
      >
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>

      <v-btn
        v-if="linkingTask === null"
        x-small
        icon
        :color="this.contrastColor"
        class="task__link-start-btn"
        @click="linkStart"
      >
        <v-icon>mdi-link</v-icon>
      </v-btn>
      <v-btn
        v-else-if="linkingTask === task.id"
        x-small
        icon
        :color="this.contrastColor"
        class="task__link-cancel-btn"
        @click="linkEnd"
      >
        <v-icon>mdi-link-off</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <TaskForm :task="task" @submit="dialog = false"></TaskForm>
    </v-dialog>
  </VueDraggableResizable>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
import { mapGetters, mapMutations } from "vuex";
import moment from "moment";

import TaskForm from "@/components/tasks/TaskForm";
import { isTask } from "@/store/tasks/schema";
import { modules } from "@/store";
import { addLink, edit, remove } from "@/store/tasks/types";
import { getContrastColor } from "@/utils";
import { getById } from "@/store/projects/types";
import { getLinkingTask, setLinkingTask } from "@/store/ui/types";

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
    ...mapGetters(modules.projects, { getProject: getById }),
    ...mapGetters(modules.ui, { linkingTask: getLinkingTask }),
    project() {
      return this.getProject(this.task.project);
    },
    color() {
      return this.project ? this.project.color : "#5f5f5f";
    },
    contrastColor() {
      return getContrastColor(this.color);
    },
    left() {
      return this.getSpaceBetween(this.firstDayInCalendar, this.task.start);
    },
    width() {
      return (
        this.getSpaceBetween(this.task.start, this.task.end) + this.pixelsPerDay //fill column for end day
      );
    },
    cssVars() {
      return {
        "--drag-cursor": this.dragging ? "grabbing" : "grab",
        "--color": this.color,
        "--contrast-color": this.contrastColor
      };
    }
  },
  methods: {
    ...mapMutations(modules.tasks, {
      editTask: edit,
      deleteTask: remove,
      addLink: addLink
    }),
    ...mapMutations(modules.ui, { setLinkingTask: setLinkingTask }),
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
    },
    linkStart() {
      this.setLinkingTask(this.task.id);
    },
    linkEnd() {
      this.addLink({ from: this.linkingTask, to: this.task.id });
      this.setLinkingTask(null);
    }
  }
};
</script>

<style lang="scss">
.task {
  background-color: var(--color);
  color: var(--contrast-color);
  border-radius: 5px;
  cursor: pointer;
  display: flex;

  &__content {
    flex: 1 1 auto;
    padding: 2px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    align-self: stretch;

    display: flex;
    align-items: center;
  }

  &__drag-area {
    cursor: var(--drag-cursor);
    flex: 1 1 auto;
    overflow: hidden;
  }

  &__title {
    margin-right: auto;
    text-overflow: ellipsis;
  }

  &__resize-handle {
    display: block !important;
    flex-shrink: 0;
    background-color: var(--contrast-color);
    opacity: 0.3;
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
