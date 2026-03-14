import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ReservationView from '../views/ReservationView.vue'
import NewReservationView from '../views/NewReservationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: ReservationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reservations/new',
      name: 'new-reservation',
      component: NewReservationView,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('access') !== null
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isLoggedIn) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router