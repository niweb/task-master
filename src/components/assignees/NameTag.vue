<template>
  <div class="name-tag">
    <span class="name-tag__name">
      {{ assignee.name }}
    </span>

    <v-btn
      x-small
      icon
      color="primary"
      class="name-tag__edit-btn"
      @click.stop="editDialog = true"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-dialog v-model="editDialog" max-width="400">
      <AssigneeForm
        :assignee="assignee"
        @submit="editDialog = false"
      ></AssigneeForm>
    </v-dialog>

    <v-btn
      x-small
      icon
      color="primary"
      class="name-tag__delete-btn"
      @click.stop="deleteDialog = true"
    >
      <v-icon>mdi-trash-can</v-icon>
    </v-btn>
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-text>
          Everything related to {{ assignee.name }} will be lost, including all
          associated tasks.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="danger" @click="deleteAssignee(assignee.id)">
            Yes, delete
          </v-btn>
          <v-btn text color="primary" @click="deleteDialog = false">
            No, keep
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AssigneeForm from "@/components/assignees/AssigneeForm";
import { isAssignee } from "@/store/assignees/schema";
import { modules } from "@/store";
import { remove } from "@/store/assignees/types";
import { mapMutations } from "vuex";

export default {
  name: "NameTag",
  components: {
    AssigneeForm
  },
  props: {
    assignee: {
      type: Object,
      validator: isAssignee,
      required: true
    }
  },
  methods: {
    ...mapMutations(modules.assignees, {
      deleteAssignee: remove
    })
  },
  data() {
    return {
      editDialog: false,
      deleteDialog: false
    };
  }
};
</script>

<style scoped lang="scss">
.name-tag {
  cursor: pointer;
  margin-top: -15px;
  background-color: white;
  padding: 2px 5px 2px 10px;
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.4);

  display: flex;
  align-items: center;

  &__name {
    margin-right: 10px;
  }
}
</style>
