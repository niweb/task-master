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
          <v-btn v-on="on" icon class="mx-1" @click="save">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span>Save</span>
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
import { mapActions } from "vuex";
import exportAppState from "@/mixins/export";
import paths from "@/router/paths";
import { save } from "@/store/boards/types";
import { modules } from "@/store";

export default {
  mixins: [exportAppState],

  data() {
    return {
      paths
    };
  },
  methods: {
    ...mapActions(modules.boards, { save: save })
  }
};
</script>
