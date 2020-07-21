<template>
  <div class="timeline">
    <div class="actions">
      <AddAssigneeButton />
      <ProjectButtons />
    </div>
    <Calendar>
      <template v-slot:default="{ scrollOffsetX, dates, zoomLevel }">
        <Planner
          :scroll-offset-x="scrollOffsetX"
          :dates="dates"
          :zoom-level="zoomLevel"
        ></Planner>
      </template>
    </Calendar>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import Calendar from "@/components/timeline/Calendar";
import AddAssigneeButton from "@/components/assignees/AddAssigneeButton";
import ProjectButtons from "@/components/projects/ProjectButtons";
import Planner from "@/components/timeline/Planner";

import { modules } from "@/store";
import { getRequestInProgress, load } from "@/store/boards/types";

export default {
  name: "Timeline",
  components: {
    AddAssigneeButton,
    Calendar,
    Planner,
    ProjectButtons
  },
  computed: {
    ...mapGetters(modules.boards, { loading: getRequestInProgress })
  },
  methods: {
    ...mapActions(modules.boards, { triggerLoad: load })
  },
  beforeMount() {
    this.triggerLoad();
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
