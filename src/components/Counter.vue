<template>
  <div class="counter">
    <button class="async-increase" @click="asyncDecrease">async -</button>

    <button class="decrease" @click="decrease">-</button>
    <div class="display">{{ count }}</div>
    <button class="increase" @click="increase">+</button>

    <button class="async-increase" @click="asyncIncrease">async +</button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  asyncDecrease,
  asyncIncrease,
  decrease,
  getCount,
  increase
} from "@/store/counter.types";
import { modules } from "@/store";

export default {
  name: "Counter",
  computed: mapGetters(modules.counter, {
    count: getCount
  }),
  methods: {
    ...mapMutations(modules.counter, {
      increase,
      decrease
    }),
    ...mapActions(modules.counter, {
      asyncIncrease,
      asyncDecrease
    })
  }
};
</script>

<style scoped lang="scss">
.counter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decrease,
.increase,
.async-increase,
.display {
  padding: 10px;
  font-size: 2rem;
  border-radius: 5px;
}

.decrease,
.increase,
.async-increase,
.async-increase {
  border: none;
  cursor: pointer;
}
.async-decrease,
.async-increase {
  margin: auto 10px;
}

.display {
  margin: 0 20px;
  border: 2px solid #afafaf;
  color: #2c3e50;
}
</style>
