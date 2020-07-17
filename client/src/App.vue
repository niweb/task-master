<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-icon large class="mx-3">mdi-calendar-check</v-icon>
        <v-toolbar-title>Taskmaster</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="mx-1" @click="downloadAppState">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <span>Export</span>
      </v-tooltip>
      <v-btn text class="mx-1" :to="paths.timeline">Timeline</v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import exportAppState from "@/mixins/export";
import paths from "@/router/paths";

export default {
  mixins: [exportAppState],

  data() {
    return {
      paths
    };
  }
};
</script>
