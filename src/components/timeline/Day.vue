<template>
  <div
    :class="
      `day
      ${isWeekend(date) ? 'day--weekend' : ''}
      ${isToday(date) ? 'day--today' : ''}`
    "
  >
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <div class="day__header" v-on="on">
          <div class="day__weekday">
            {{ minimal ? date.format("dd")[0] : date.format("ddd") }}
          </div>
          <div class="day__date">
            {{ date.format("DD") }}
          </div>
        </div>
      </template>
      <span>{{ date.format("ll") }}</span>
    </v-tooltip>
    <div class="day__body"></div>
  </div>
</template>

<script>
import moment from "moment";
const today = moment();

export default {
  name: "Day",
  props: {
    date: moment,
    minimal: {
      type: Boolean,
      default: true,
      required: false
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
  border: 1px solid #efefef;
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

  &--today &__body {
    position: relative;
    &::before {
      content: "";
      height: 100%;
      width: 3px;
      background-color: var(--v-primary-base);
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
