import Vue from "vue";
import VueRouter from "vue-router";
import paths, { pathNames } from "./paths";

import store, { modules } from "@/store";
import { setCurrentBoardId } from "@/store/boards/types";

Vue.use(VueRouter);

const routes = [
  {
    path: paths.index,
    name: pathNames.index,
    component: () => import("../views/Index.vue")
  },
  {
    path: paths.timeline,
    name: pathNames.timeline,
    component: () => import("../views/Timeline.vue")
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  switch (to.name) {
    case pathNames.timeline:
      store.commit(`${modules.boards}/${setCurrentBoardId}`, to.params.id);
      break;
    case pathNames.index:
      store.commit(`${modules.boards}/${setCurrentBoardId}`, null);
      break;
  }
  next();
});

export default router;
