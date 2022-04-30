import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../views/HomeView.vue"
import SignIn from "../views/SignInView.vue"
import { isLoggedIn } from "@/firebase"
import Add from "@/views/AddView.vue"
import Options from "@/views/OptionsView.vue"

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
  if (to.path === "/login") {
    next()
  } else {
    isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        next("/login")
      } else {
        next()
      }
    })
  }
})
export default router
