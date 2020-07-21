<template>
  <v-menu v-model="open" :close-on-content-click="false" max-width="290">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        :value="displayValue"
        :label="label"
        @click:clear="date = null"
        clearable
        readonly
        outlined
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" @change="onChange"></v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment";

const momentToIso = moment => moment?.format("YYYY-MM-DD");

export default {
  name: "DatePicker",
  props: {
    label: String,
    value: moment
  },
  data() {
    return {
      date: momentToIso(this.value),
      open: false
    };
  },
  watch: {
    value: function() {
      this.date = momentToIso(this.value);
    }
  },
  computed: {
    displayValue() {
      return this.date ? moment(this.date).format("ll") : "";
    }
  },
  methods: {
    onChange(value) {
      this.open = false;
      this.$emit("input", moment(value));
    }
  }
};
</script>
