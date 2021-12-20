import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import { isLoggedIn } from '@/firebase'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: SignIn,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        next('/login')
      } else {
        next()
      }
    })
  }
})
export default router
