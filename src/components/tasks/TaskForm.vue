<template>
  <v-sheet class="pa-10">
    <v-form ref="form" class="task-form" @submit="handleSubmit">
      <v-text-field
        v-model="values.title"
        label="Title"
        required
        outlined
        autofocus
      ></v-text-field>
      <v-select
        v-model="values.assignee"
        :items="assignees"
        item-text="name"
        item-value="id"
        label="Assignee"
        outlined
      ></v-select>
      <DatePicker
        v-model="values.start"
        label="Start Date"
        required
        outlined
      ></DatePicker>
      <DatePicker
        v-model="values.end"
        label="End Date"
        required
        outlined
      ></DatePicker>
      <v-btn color="primary" type="submit">
        <div v-if="isNewTask"><v-icon>mdi-plus</v-icon>Add Task</div>
        <div v-else>Save</div>
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
import moment from "moment";
import { mapGetters, mapMutations } from "vuex";
import { add, edit } from "@/store/tasks/types";
import DatePicker from "@/components/tasks/DatePicker";
import { getAll } from "@/store/assignees/types";
import { modules } from "@/store";
import { isPartialTask, isTask } from "@/store/tasks/schema";

const defaultValues = {
  id: null,
  title: "",
  assignee: 0,
  start: moment(),
  end: moment()
};

export default {
  name: "TaskForm",
  components: { DatePicker },
  props: {
    task: {
      type: Object,
      validator: prop => (prop.id ? isTask(prop) : isPartialTask(prop))
    }
  },
  computed: {
    ...mapGetters(modules.assignees, {
      assignees: getAll
    }),
    isNewTask() {
      return this.task?.id == null;
    }
  },
  methods: {
    ...mapMutations(modules.tasks, { addTask: add, editTask: edit }),
    handleSubmit(e) {
      e.preventDefault();
      const submitValues = {
        ...this.values,
        start: this.values.start?.startOf("day"),
        end: this.values.end?.endOf("day")
      };

      if (this.isNewTask) {
        this.addTask(submitValues);
        this.resetForm();
      } else {
        this.editTask({ ...this.task, ...submitValues });
      }

      this.$emit("submit");
    },

    resetForm() {
      this.values = defaultValues;
    }
  },
  data: function() {
    return {
      values: {
        ...defaultValues,
        ...this.task
      }
    };
  },
  watch: {
    task() {
      this.values = {
        ...defaultValues,
        ...this.task
      };
    }
  }
};
</script>
