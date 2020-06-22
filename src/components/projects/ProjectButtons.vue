<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          @click.stop="dialog = true"
          class="add-project-button mx-2"
        >
          <v-icon>mdi-folder-plus</v-icon>
          <v-dialog v-model="dialog" max-width="400">
            <ProjectForm @submit="dialog = false" />
          </v-dialog>
        </v-btn>
      </template>
      <span>Add Project</span>
    </v-tooltip>
    <ProjectButton
      v-for="project in projects"
      :key="project.id"
      :project="project"
      class="mx-1"
    >
    </ProjectButton>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { modules } from "@/store";
import {
  getAll as getAllProjects,
  getSelected,
  select,
  remove
} from "@/store/projects/types";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectButton from "@/components/projects/ProjectButton";

export default {
  name: "ProjectButtons",
  components: {
    ProjectForm,
    ProjectButton
  },

  computed: {
    ...mapGetters(modules.projects, {
      projects: getAllProjects,
      selected: getSelected
    })
  },

  methods: {
    ...mapMutations(modules.projects, { select, remove })
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style lang="scss"></style>
