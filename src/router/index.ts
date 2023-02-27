import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/HomeView.vue"
import Add from "@/views/AddView.vue"
import Options from "@/views/OptionsView.vue"
import SignIn from "@/views/SignInView.vue"
import Overview from "@/views/OverviewView.vue"
import { useTokenStore } from "@/stores/token"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: SignIn,
  },
  {
    path: "/add",
    name: "Add",
    component: Add,
  },
  {
    path: "/options",
    name: "Options",
    component: Options,
  },
  {
    path: "/overview",
    name: "Overview",
    component: Overview,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  if (to.path === "/login") {
    next()
  } else if (tokenStore.getUid()) {
    next()
  } else {
    next("/login")
  }
})
export default router
