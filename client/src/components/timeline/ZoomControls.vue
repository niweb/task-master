<template>
  <v-btn-toggle rounded v-model="activeButton" @change="resetActiveButton">
    <v-btn fab :disabled="!canZoomOut" @click="$emit('zoom', -1)">
      <v-icon>mdi-magnify-minus-outline</v-icon>
    </v-btn>
    <v-btn @click="$emit('jump')">
      <v-icon>mdi-magnify</v-icon>   
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
