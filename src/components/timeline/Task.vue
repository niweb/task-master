<template>
  <div class="task" @click.stop="dialog = true">
    {{ task.title }}
    <v-dialog v-model="dialog" max-width="400">
      <TaskForm :task="task" @submit="dialog = false"></TaskForm>
    </v-dialog>
  </div>
</template>

<script>
import TaskForm from "@/components/task-form/TaskForm";

export default {
  name: "Task",
  props: {
    task: Object
  },
  components: {
    TaskForm
  },
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style scoped lang="scss">
.task {
  background-color: #2c3e50;
  color: #fff;
  border-radius: 5px;
  padding: 2px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>
