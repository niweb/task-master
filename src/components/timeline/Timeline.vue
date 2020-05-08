<template>
  <div class="timeline">
    Imagine the Timeline here. For now, those are the tasks:
    <div class="tasks">
      <Task v-for="task in tasks" :key="task.id" :task="task"></Task>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAll } from "@/store/tasks.types";
import { modules } from "@/store";

import Task from "./Task";

export default {
  name: "Timeline",
  computed: mapGetters(modules.tasks, { tasks: getAll }),
  components: {
    Task
  }
};
</script>

<style scoped lang="scss">
.timeline {
  width: 100%;
  display: flex;
}
.tasks {
  margin-top: 20px;
  display: flex;
  flex-flow: column;
}
</style>
