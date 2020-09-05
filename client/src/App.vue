<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon :to="paths.index">
              <v-icon large class="mx-3">mdi-calendar-check</v-icon>
            </v-btn>
          </template>
          <span>Home</span>
        </v-tooltip>
        <v-toolbar-title>Taskmaster</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon
            class="mx-1"
            @click="save"
            :disabled="!needsSave"
          >
            <v-progress-circular
              indeterminate
              size="32"
              v-if="saving"
            ></v-progress-circular>
            <v-icon v-else-if="saved">mdi-check</v-icon>
            <v-icon v-else>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span v-if="saving">Saving</span>
        <span v-else-if="saved">Saved</span>
        <span v-else>Save</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mx-1" @click="downloadAppState">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <span>Export</span>
      </v-tooltip>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import exportAppState from "@/mixins/export";
import paths from "@/router/paths";
import { getNeedsSave, save } from "@/store/boards/types";
import { modules } from "@/store";
import { getRequestInProgress, requestTypes } from "./store/boards/types";

export default {
  mixins: [exportAppState],

  data() {
    return {
      paths,
      saved: false
    };
  },
  methods: {
    ...mapActions(modules.boards, { save: save })
  },
  computed: {
    ...mapGetters(modules.boards, {
      requestStatus: getRequestInProgress,
      needsSave: getNeedsSave
    }),
    saving() {
      return this.requestStatus === requestTypes.save;
    }
  },
  watch: {
    requestStatus(newValue, oldValue) {
      if (oldValue === requestTypes.save && newValue === null) {
        this.saved = true;
        setTimeout(() => {
          this.saved = false;
        }, 1000);
      }
    }
  }
};
</script>
