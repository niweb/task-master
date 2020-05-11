<template>
  <div class="timeline">
    <Calendar class="mt-10" />
    <TaskForm />
  </div>
</template>

<script>
import Calendar from "@/components/timeline/Calendar";
import TaskForm from "@/components/task-form/TaskForm";

export default {
  name: "Timeline",
  components: {
    Calendar,
    TaskForm
  }
};
</script>
