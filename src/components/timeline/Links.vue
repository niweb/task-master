<template>
  <svg
    :viewBox="`0 0 ${parentRect.width || 0} ${parentRect.height || 0}`"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 60 60"
        refX="60"
        refY="30"
        markerUnits="strokeWidth"
        markerWidth="16"
        markerHeight="10"
        orient="auto"
      >
        <path d="M 0 0 L 60 30 L 0 60 z" fill="black" />
      </marker>
    </defs>
    <line
      v-for="(line, index) in lines"
      :key="index"
      :x1="line.from[0]"
      :y1="line.from[1]"
      :x2="line.to[0]"
      :y2="line.to[1]"
      stroke="black"
      marker-end="url(#arrow)"
    />
  </svg>
</template>

<script>
import { mapGetters } from "vuex";
import { modules } from "@/store";
import { getLinks } from "@/store/tasks/types";

export default {
  name: "Links",
  props: {},
  data() {
    return {
      parentRect: {},
      linkRects: [],
      lines: []
    };
  },
  mounted() {
    this.parentRect = this.$parent.$el.getBoundingClientRect();
    this.lines = this.calculateLineCoordinates();
  },
  computed: {
    ...mapGetters(modules.tasks, {
      links: getLinks
    })
  },
  methods: {
    getTaskElRect(taskId) {
      const taskEl = document.querySelector(`.task[data-id="${taskId}"]`);
      return taskEl.getBoundingClientRect();
    },
    calculateLineCoordinates() {
      return this.links.map(link => {
        const from = this.getTaskElRect(link.from);
        const to = this.getTaskElRect(link.to);
        return {
          from: [
            from.right - this.parentRect.left,
            from.top + from.height / 2 - this.parentRect.top
          ],
          to: [
            to.left - this.parentRect.left,
            to.top + to.height / 2 - this.parentRect.top
          ]
        };
      });
    }
  },
  watch: {
    links() {
      this.lines = this.calculateLineCoordinates();
    }
  }
};
</script>

<style scoped lang="scss"></style>
