import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../views/HomeView.vue"
import Add from "@/views/AddView.vue"
import Options from "@/views/OptionsView.vue"
import SignIn from "@/views/SignInView.vue"
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
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  if (to.path === "/login") {
    next()
  } else if (tokenStore.getToken()) {
    next()
  } else {
    next("/login")
  }
})
export default router
