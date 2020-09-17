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
    @dragstop="onDragStop"
    :onDragStart="onDragStart"
    :onDrag="onDrag"
    class-name-handle="task__resize-handle"
    drag-handle=".task__drag-area"
    class="task"
    :style="cssVars"
    :data-id="task.id"
  >
    <v-tooltip top :disabled="!enableTooltip">
      <template v-slot:activator="{ on }">
        <div class="task__content" v-on="on">
          <template v-if="isCurrentlyLinking && !isLinkingTask">
            <v-btn
              v-if="!isLinkedToLinkingTask"
              x-small
              icon
              :color="contrastColor"
              class="task__link-btn mr-1"
              @click="addLink"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              v-else
              x-small
              icon
              :color="contrastColor"
              class="task__link-btn mr-1"
              @click="removeLink"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>

          <div class="task__drag-area" ref="titleContainer">
            <span class="task__title" ref="titleSpan">
              {{ task.title }}
            </span>
          </div>

          <template v-if="isCurrentlyLinking">
            <template v-if="isLinkingTask">
              <v-btn
                x-small
                icon
                :color="contrastColor"
                class="task__link-cancel-btn"
                @click.stop="endLinking"
              >
                <v-icon>mdi-link-variant-off</v-icon>
              </v-btn>
            </template>
          </template>
          <template v-else>
            <v-menu
              open-on-hover
              bottom
              offset-y
              nudge-left="25"
              v-if="actionButtonsInMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :color="contrastColor"
                  x-small
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-sheet class="pa-1">
                <template v-for="({ onClick, icon }, index) in actions">
                  <v-btn :key="index" x-small icon @click.stop="onClick">
                    <v-icon>{{ icon }}</v-icon>
                  </v-btn>
                </template>
              </v-sheet>
            </v-menu>

            <template v-else>
              <template v-for="({ cls, onClick, icon }, index) in actions">
                <v-btn
                  :key="index"
                  x-small
                  icon
                  :color="contrastColor"
                  :class="cls"
                  @click.stop="onClick"
                >
                  <v-icon>{{ icon }}</v-icon>
                </v-btn>
              </template>
            </template>
          </template>
        </div>
      </template>
      <span>{{ task.title }}</span>
    </v-tooltip>

    <v-dialog v-model="dialog" max-width="400">
      <TaskForm :task="task" @submit="dialog = false"></TaskForm>
    </v-dialog>
  </VueDraggableResizable>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
import { mapActions, mapGetters, mapMutations } from "vuex";

import { getContrastColor } from "@/utils";
import TaskForm from "@/components/tasks/TaskForm";

import { modules } from "@/store";
import { isTask } from "@/store/tasks/schema";
import {
  addLink,
  getEarliestStartDateOfTask,
  getLinksFromTask,
  remove,
  removeLink,
  update
} from "@/store/tasks/types";
import { getById } from "@/store/projects/types";
import { getLinkingTask, setLinkingTask } from "@/store/ui/types";
import { getPixelsPerDay } from "@/store/calendar/types";
import dates from "@/mixins/dates";

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
    }
  },
  mixins: [dates],
  components: {
    TaskForm,
    VueDraggableResizable
  },
  data() {
    return {
      dialog: false,
      dragging: false,
      marginY: 1,
      enableTooltip: false,
      fab: false
    };
  },

  mounted() {
    this.calculateTooltipEnabled();
  },

  updated() {
    this.calculateTooltipEnabled();
  },

  computed: {
    ...mapGetters(modules.tasks, {
      getLinksFromTask: getLinksFromTask,
      getEarliestStartDateOfTask: getEarliestStartDateOfTask
    }),
    ...mapGetters(modules.projects, { getProject: getById }),
    ...mapGetters(modules.ui, { linkingTask: getLinkingTask }),
    ...mapGetters(modules.calendar, {
      pixelsPerDay: getPixelsPerDay
    }),
    project() {
      return this.getProject(this.task.project);
    },
    color() {
      return this.project ? this.project.color : "#5f5f5f";
    },
    contrastColor() {
      return getContrastColor(this.color);
    },
    minX() {
      const earliestStartDate = this.getEarliestStartDateOfTask(this.task.id);
      if (!earliestStartDate) {
        return null;
      }
      return this.getPositionOfDay(earliestStartDate);
    },
    left() {
      return this.getPositionOfDay(this.task.start);
    },
    width() {
      return this.getSpaceBetweenDays(this.task.start, this.task.end, true);
    },
    actionButtonsInMenu() {
      return this.width < 150;
    },
    actions() {
      return [
        {
          cls: "task__edit-btn",
          onClick: () => (this.dialog = true),
          icon: "mdi-pencil"
        },
        {
          cls: "task__delete-btn",
          onClick: () => this.deleteTask(this.task.id),
          icon: "mdi-trash-can"
        },
        ...(this.isCurrentlyLinking
          ? []
          : [
              {
                cls: "task__link-start-btn",
                onClick: this.startLinking,
                icon: "mdi-link-variant"
              }
            ])
        // ...(this.isCurrentlyLinking &&
        //   this.isLinkingTask && [
        //     {
        //       cls: "task__link-cancel-btn",
        //       onClick: this.endLinking,
        //       icon: "mdi-link-variant-off"
        //     }
        //   ])
      ];
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
    calculateTooltipEnabled() {
      this.$nextTick(() => {
        const containerWidth = this.$refs.titleContainer?.offsetWidth;
        const textWidth = this.$refs.titleSpan?.offsetWidth;
        this.enableTooltip = containerWidth < textWidth;
      });
    },
    onResize(x, y, width) {
      this.updateTask(x, width);
    },
    onDragStart() {
      this.dragging = true;
    },
    onDrag(x) {
      if (this.minX && x < this.minX) {
        this.dragging = false;
        return false;
      }
    },
    onDragStop(x) {
      this.updateTask(x, this.width);
      this.dragging = false;
    },
    updateTask(x, width) {
      const assignee = Number(sessionStorage.getItem("assigneeID"));
      if (this.task.assignee !== assignee) {
        this.editTask({ ...this.task, assignee });
      }
      if (x !== this.left || width !== this.width) {
        const start = this.getDayByPositionX(x).startOf("d");
        const end = this.getDayByPositionX(x + width - 1).endOf("d");
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
    text-overflow: ellipsis;
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
