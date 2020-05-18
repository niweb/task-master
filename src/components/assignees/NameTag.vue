<template>
  <div class="name">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <span @click.stop="dialog = true" v-on="on">
          {{ assignee.name }}
        </span>
      </template>
      Edit {{ assignee.name }}
    </v-tooltip>
    <v-dialog v-model="dialog" max-width="400">
      <AssigneeForm
        :assignee="assignee"
        @submit="dialog = false"
      ></AssigneeForm>
    </v-dialog>
  </div>
</template>

<script>
import AssigneeForm from "@/components/assignees/AssigneeForm";
import { isAssignee } from "@/store/assignees/schema";

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
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style scoped lang="scss">
.name {
  cursor: pointer;
  margin-top: -15px;
  background-color: white;
  padding: 2px 15px;
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.4);
}
</style>
