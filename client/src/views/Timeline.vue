<template>
  <div class="timeline">
    <div class="actions">
      <AddAssigneeButton />
    </div>
    <Calendar />
  </div>
</template>

<script>
import Calendar from "@/components/timeline/Calendar";
import AddAssigneeButton from "@/components/assignees/AddAssigneeButton";

export default {
  name: "Timeline",
  components: {
    AddAssigneeButton,
    Calendar
  }
};
</script>

<style scoped lang="scss">
.timeline {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.actions {
  display: flex;
  padding: 20px;
  flex-direction: row;
  align-items: flex-start;
}
</style>
