import Vue from "vue";
import VueRouter from "vue-router";
import paths from "./paths";

Vue.use(VueRouter);

const routes = [
  {
    path: paths.index,
    component: () => import("../views/Index.vue")
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
