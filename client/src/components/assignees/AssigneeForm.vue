<template>
  <v-sheet class="pa-10">
    <v-form ref="form" class="task-form" @submit="handleSubmit">
      <v-text-field
        v-model="values.name"
        label="Name"
        required
        outlined
        autofocus
      ></v-text-field>
      <v-btn color="primary" type="submit">
        <div v-if="isNewAssignee"><v-icon>mdi-plus</v-icon>Add Assignee</div>
        <div v-else>Save</div>
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
import { mapMutations } from "vuex";
import { add, edit } from "@/store/assignees/types";
import { modules } from "@/store";
import { isAssignee, isPartialAssignee } from "@/store/assignees/schema";

const defaultValues = {
  id: null,
  name: ""
};

export default {
  name: "AssigneeForm",
  props: {
    assignee: {
      type: Object,
      validator: prop => (prop.id ? isAssignee(prop) : isPartialAssignee(prop))
    }
  },
  computed: {
    isNewAssignee() {
      return this.assignee?.id == null;
    }
  },
  methods: {
    ...mapMutations(modules.assignees, {
      addAssignee: add,
      editAssignee: edit
    }),
    handleSubmit(e) {
      e.preventDefault();

      if (this.isNewAssignee) {
        this.addAssignee(this.values);
        this.resetForm();
      } else {
        this.editAssignee({ ...this.assignee, ...this.values });
      }

      this.$emit("submit");
    },
    resetForm() {
      this.values = { ...defaultValues };
    }
  },
  data: function() {
    return {
      values: {
        ...defaultValues,
        ...this.assignee
      }
    };
  }
};
</script>
