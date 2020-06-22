<template>
  <v-btn
    :color="project.color"
    :outlined="!isSelected"
    :style="isSelected && { color: getTextColor }"
    @click="select(project.id)"
  >
    {{ project.name }}

    <template v-if="isSelected">
      <v-btn
        x-small
        icon
        class="ml-3"
        :color="getTextColor"
        @click.stop="dialog = true"
      >
        <v-icon>mdi-pencil</v-icon>
        <v-dialog v-model="dialog" max-width="400">
          <ProjectForm :project="project" @submit="dialog = false" />
        </v-dialog>
      </v-btn>
      <v-btn x-small icon :color="getTextColor" @click="remove(project.id)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>
  </v-btn>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { modules } from "@/store";
import { getSelected, select, remove } from "@/store/projects/types";
import ProjectForm from "@/components/projects/ProjectForm";
import { getContrastColor } from "@/utils";
import { isProject } from "@/store/projects/schema";

export default {
  name: "ProjectButton",
  props: {
    project: {
      type: Object,
      validator: isProject
    }
  },
  components: {
    ProjectForm
  },
  computed: {
    ...mapGetters(modules.projects, {
      selected: getSelected
    }),
    isSelected() {
      return this.selected === this.project.id;
    },
    getTextColor() {
      return getContrastColor(this.project.color);
    }
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
