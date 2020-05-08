import Vue from "vue";
import VueRouter from "vue-router";
import paths from "./paths";

Vue.use(VueRouter);

const routes = [
  {
    path: paths.counter,
    name: "Counter",
    component: () => import("../views/Counter.vue")
  },
  {
    path: paths.timeline,
    name: "Timeline",
    component: () => import("../views/Timeline.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
