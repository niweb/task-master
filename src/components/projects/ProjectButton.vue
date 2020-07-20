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
        @click.stop="editDialog = true"
      >
        <v-icon>mdi-pencil</v-icon>
        <v-dialog v-model="editDialog" max-width="400">
          <ProjectForm :project="project" @submit="editDialog = false" />
        </v-dialog>
      </v-btn>

      <v-btn
        x-small
        icon
        :color="getTextColor"
        @click.stop="deleteDialog = true"
      >
        <v-icon>mdi-trash-can</v-icon>
        <v-dialog v-model="deleteDialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Are you sure?</v-card-title>
            <v-card-text>
              All tasks associated to {{ project.name }} will be permanently
              deleted.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="danger" @click="remove(project.id)">
                Yes, delete
              </v-btn>
              <v-btn text color="primary" @click="deleteDialog = false">
                No, keep
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn>
    </template>
  </v-btn>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
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
    ...mapMutations(modules.projects, { select }),
    ...mapActions(modules.projects, { remove })
  },
  data() {
    return {
      editDialog: false,
      deleteDialog: false
    };
  }
};
</script>
