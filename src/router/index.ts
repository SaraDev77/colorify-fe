import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import { useAuthStore } from '../stores/auth.store'
import PortalView from '../views/PortalView.vue'
// import { colorsService } from '../utils/tasksRequests.util'

// const routeGuard: NavigationGuard = async (to, from, next) => {
//   const { id } = to.params
//   try {
//     const response = await colorsService.fetchSingleColor(String(id))

//     if (response) next()
//   } catch (error) {
//     console.error('Invalid Task ID:', error)
//     next({ name: 'not-found' })
//   }
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'portal',
      component: PortalView,
      meta: { hideToolbar: true, requiresGuest: true },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideToolbar: true, requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { hideToolbar: true, requiresGuest: true },
    },
    {
      name: 'not-found',
      path: '/:catchAll(.*)*',
      component: NotFound,
    },
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.user && to.meta.requiresGuest) {
    return next({ name: 'home' })
  }

  if (to.name === 'login' || to.name === 'not-found' || to.name === 'register'||to.name === 'portal') {
    return next()
  }

  if (!authStore.user) {
    return next({ name: 'portal' })
  }
  next()
})

export default router
