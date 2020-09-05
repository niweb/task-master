<template>
  <div class="timeline">
    <div class="actions">
      <AddAssigneeButton />
      <ProjectButtons />
    </div>
    <Calendar>
      <Planner></Planner>
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
import { getNeedsSave, getRequestInProgress, load } from "@/store/boards/types";
import { requestTypes } from "../store/boards/types";

export default {
  name: "Timeline",
  components: {
    AddAssigneeButton,
    Calendar,
    Planner,
    ProjectButtons
  },
  computed: {
    ...mapGetters(modules.boards, {
      requestStatus: getRequestInProgress,
      needsSave: getNeedsSave
    }),
    loading() {
      return this.requestStatus === requestTypes.load;
    }
  },
  methods: {
    ...mapActions(modules.boards, { triggerLoad: load }),
    onPageLeave(event) {
      if (this.needsSave) {
        event.returnValue =
          "Are you sure you want to leave this page? Any unsaved changes will be discarded.";
      }
    }
  },
  beforeMount() {
    this.triggerLoad();
    window.addEventListener("beforeunload", this.onPageLeave);
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
