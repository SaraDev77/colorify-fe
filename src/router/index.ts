import { createRouter, createWebHistory, type NavigationGuard } from 'vue-router'
import HomeView from '../views/home-view.vue'
import NotFound from '../views/not-found.vue'
import LoginView from '../views/auth/login-view.vue'
import RegisterView from '../views/auth/register-view.vue'
import { useAuthStore } from '../stores/auth.store'
import PortalView from '../views/portal-view.vue'
import ColorDetails from '@/views/color-details.vue'
import { colorsService } from '@/utils/color-requests.util'


const routeGuard: NavigationGuard = async (to, from, next) => {
  const { id } = to.params
  try {
    const response = await colorsService.fetchSingleColor(String(id))

    if (response) next()
  } catch (error) {
    console.error('Invalid Task ID:', error)
    next({ name: 'not-found' })
  }
}

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
      path: '/details/:id',
      name: 'color-details',
      component: ColorDetails,
      beforeEnter: [routeGuard],
      strict: true,
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
