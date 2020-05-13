<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-icon large class="mx-3">mdi-calendar-check</v-icon>
        <v-toolbar-title>Taskmaster</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn text class="mx-1" to="/timeline">Timeline</v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>
