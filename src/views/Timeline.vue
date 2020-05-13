<template>
  <div class="timeline">
    <Calendar />
  </div>
</template>

<script>
import Calendar from "@/components/timeline/Calendar";

export default {
  name: "Timeline",
  components: {
    Calendar
  }
};
</script>

<style scoped lang="scss">
.timeline {
  height: 100%;
  padding-top: 40px;
}
</style>
