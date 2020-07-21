<template>
  <v-sheet class="pa-10">
    <v-form ref="form" class="project-form" @submit="handleSubmit">
      <v-text-field
        v-model="values.name"
        label="Title"
        required
        outlined
        autofocus
      ></v-text-field>
      <v-color-picker
        v-model="values.color"
        label="Color"
        show-swatches
        required
      ></v-color-picker>
      <v-btn color="primary" type="submit" class="mt-5">
        <div v-if="isNewProject"><v-icon>mdi-plus</v-icon>Add Project</div>
        <div v-else>Save</div>
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
import { mapMutations } from "vuex";
import { add, edit } from "@/store/projects/types";
import { modules } from "@/store";
import { isProject, isPartialProject } from "@/store/projects/schema";

export default {
  name: "ProjectForm",
  props: {
    project: {
      type: Object,
      validator: prop => (prop.id ? isProject(prop) : isPartialProject(prop))
    }
  },
  computed: {
    isNewProject() {
      return this.project?.id == null;
    }
  },
  methods: {
    ...mapMutations(modules.projects, {
      addProject: add,
      editProject: edit
    }),
    handleSubmit(e) {
      e.preventDefault();

      if (this.isNewProject) {
        this.addProject(this.values);
        this.resetForm();
      } else {
        this.editProject({ ...this.project, ...this.values });
      }

      this.$emit("submit");
    },

    resetForm() {
      this.values = this.getDefaultValues();
    },

    getDefaultValues() {
      return {
        id: null,
        name: "",
        color: "#2c3e50"
      };
    }
  },
  data: function() {
    return {
      values: {
        ...this.getDefaultValues(),
        ...this.project
      }
    };
  },
  watch: {
    project() {
      this.values = {
        ...this.getDefaultValues(),
        ...this.project
      };
    }
  }
};
</script>
