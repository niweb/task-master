<template>
  <div class="timeline">
    <div class="actions">
      <AddAssigneeButton />
      <ProjectButtons />
    </div>
    <Calendar>
      <template v-slot:default="{ scrollOffsetX, dates }">
        <Planner :scroll-offset-x="scrollOffsetX" :dates="dates"></Planner>
      </template>
    </Calendar>
  </div>
</template>

<script>
import Calendar from "@/components/timeline/Calendar";
import AddAssigneeButton from "@/components/assignees/AddAssigneeButton";
import ProjectButtons from "@/components/projects/ProjectButtons";
import Planner from "@/components/timeline/Planner";

export default {
  name: "Timeline",
  components: {
    AddAssigneeButton,
    Calendar,
    Planner,
    ProjectButtons
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
  justify-content: space-between;
  align-items: flex-start;
}
</style>
