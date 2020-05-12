<template>
  <v-sheet class="ma-10">
    <v-form ref="form" class="task-form" @submit="onSubmit">
      <v-text-field
        v-model="values.title"
        label="Title"
        required
        outlined
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
        <v-icon>mdi-plus</v-icon>
        Add Task
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
import moment from "moment";
import { mapGetters, mapMutations } from "vuex";
import { add } from "@/store/tasks.types";
import DatePicker from "@/components/task-form/DatePicker";
import { getAll } from "@/store/assignees.types";
import { modules } from "@/store";

const defaultValues = {
  title: "",
  assignee: 0,
  start: moment(),
  end: moment()
};

export default {
  name: "TaskForm",
  components: { DatePicker },
  props: {
    task: Object
  },
  computed: {
    ...mapGetters(modules.assignees, {
      assignees: getAll
    })
  },
  methods: {
    ...mapMutations(modules.tasks, { addTask: add }),
    onSubmit(e) {
      e.preventDefault();
      this.addTask({
        ...this.values,
        start: this.values.start?.startOf("day"),
        end: this.values.end?.endOf("day")
      });

      this.resetForm();
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
  }
};
</script>

<style scoped lang="scss">
.task-form {
}
</style>
