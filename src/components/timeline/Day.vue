<template>
  <div :class="`day ${isWeekend(date) ? 'day--weekend' : ''}`" :style="cssVars">
    <div class="day__header">
      <div class="day__weekday">
        {{ date.format("ddd") }}
      </div>
      <div class="day__date">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-chip v-on="on" :color="isToday(date) ? 'primary' : 'default'">
              {{ date.format("DD") }}
            </v-chip>
          </template>
          <span>{{ date.format("ll") }}</span>
        </v-tooltip>
      </div>
    </div>
    <div class="day__body"></div>
  </div>
</template>

<script>
import moment from "moment";
const today = moment();

export default {
  name: "Day",
  props: {
    date: Object /** Moment */,
    width: {
      type: Number,
      required: false,
      default: 50
    }
  },
  computed: {
    cssVars() {
      return {
        "--width": `${this.width}px`
      };
    }
  },
  methods: {
    isToday(day) {
      return day.isSame(today, "day");
    },
    isWeekend(day) {
      const weekday = day.format("e");
      return weekday === "0" || weekday === "6";
    }
  }
};
</script>

<style scoped lang="scss">
.day {
  width: var(--width);
  border: 1px solid #efefef;
  flex-shrink: 0;

  height: 100%;
  display: flex;
  flex-direction: column;

  &--weekend {
    background: repeating-linear-gradient(
      -55deg,
      transparent,
      transparent 5px,
      #efefef 5px,
      #efefef 10px
    );
  }

  &__header {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  &__weekday {
    color: #afafaf;
  }

  &__body {
    flex-grow: 1;
    min-height: 300px;
  }
}
</style>
