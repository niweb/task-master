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
    :data-id="task.id"
  >
    <div class="task__content">
      <template v-if="isCurrentlyLinking && !isLinkingTask">
        <v-btn
          v-if="!isLinkedToLinkingTask"
          x-small
          icon
          :color="this.contrastColor"
          class="task__link-btn mr-1"
          @click="addLink"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          v-else
          x-small
          icon
          :color="this.contrastColor"
          class="task__link-btn mr-1"
          @click="removeLink"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </template>

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
        v-if="!isCurrentlyLinking"
        x-small
        icon
        :color="this.contrastColor"
        class="task__link-start-btn"
        @click="startLinking"
      >
        <v-icon>mdi-link-variant</v-icon>
      </v-btn>
      <v-btn
        v-else-if="isCurrentlyLinking && isLinkingTask"
        x-small
        icon
        :color="this.contrastColor"
        class="task__link-cancel-btn"
        @click="endLinking"
      >
        <v-icon>mdi-link-variant-off</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <TaskForm :task="task" @submit="dialog = false"></TaskForm>
    </v-dialog>
  </VueDraggableResizable>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
import { mapActions, mapGetters, mapMutations } from "vuex";
import moment from "moment";

import { getContrastColor } from "@/utils";
import TaskForm from "@/components/tasks/TaskForm";

import { modules } from "@/store";
import { isTask } from "@/store/tasks/schema";
import {
  addLink,
  update,
  remove,
  getLinksFromTask,
  removeLink
} from "@/store/tasks/types";
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
    ...mapGetters(modules.tasks, { getLinksFromTask: getLinksFromTask }),
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
    isCurrentlyLinking() {
      return this.linkingTask !== null;
    },
    linkingTaskLinks() {
      return this.isCurrentlyLinking
        ? this.getLinksFromTask(this.linkingTask)
        : [];
    },
    isLinkingTask() {
      return this.linkingTask === this.task.id;
    },
    isLinkedToLinkingTask() {
      return this.linkingTaskLinks.includes(this.task.id);
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
      removeLinkInStore: removeLink
    }),
    ...mapActions(modules.tasks, {
      deleteTask: remove,
      addLinkInStore: addLink,
      editTask: update
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
    startLinking() {
      this.setLinkingTask(this.task.id);
    },
    addLink() {
      this.addLinkInStore({ from: this.linkingTask, to: this.task.id });
      this.endLinking();
    },
    removeLink() {
      this.removeLinkInStore({ from: this.linkingTask, to: this.task.id });
      this.endLinking();
    },
    endLinking() {
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
