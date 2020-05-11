<template>
  <div class="task">
    {{ task.title }}
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
  padding: 2px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
