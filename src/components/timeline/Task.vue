<template>
  <div class="task">
    <div>
      {{ task.title }}
    </div>
    <div>{{ task.start.format("ll") }} - {{ task.end.format("ll") }}</div>
  </div>
</template>

<script>
export default {
  name: "Task",
  props: {
    task: Object
  }
};
</script>

<style scoped lang="scss">
.task {
  background-color: #2c3e50;
  color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
}
</style>
