<template>
  <v-btn-toggle v-model="activeButton" @change="resetActiveButton">
    <v-btn @click="$emit('jumpToToday')">
      <v-icon>mdi-calendar-today</v-icon>
    </v-btn>
    <v-btn fab :disabled="!canZoomOut" @click="$emit('zoom', -1)">
      <v-icon>mdi-magnify-minus-outline</v-icon>
    </v-btn>
    <v-btn fab :disabled="!canZoomIn" @click="$emit('zoom', 1)">
      <v-icon>mdi-magnify-plus-outline</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: "ZoomControls",

  props: {
    canZoomOut: {
      type: Boolean,
      required: false,
      default: true
    },
    canZoomIn: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    activeButton: null
  }),

  methods: {
    resetActiveButton() {
      this.$nextTick(() => {
        this.activeButton = null;
      });
    }
  }
};
</script>
