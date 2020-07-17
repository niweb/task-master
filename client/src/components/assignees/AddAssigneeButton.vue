<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click.stop="dialog = true" class="add-person-btn">
        <v-icon>mdi-account-plus</v-icon>
        <v-dialog v-model="dialog" max-width="400">
          <AssigneeForm @submit="dialog = false" />
        </v-dialog>
      </v-btn>
    </template>
    <span>Add person</span>
  </v-tooltip>
</template>

<script>
import AssigneeForm from "@/components/assignees/AssigneeForm";

export default {
  name: "AddAssigneeButton",
  components: {
    AssigneeForm
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>
