import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ReservationView from '../views/ReservationView.vue'
import NewReservationView from '../views/NewReservationView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import AdminLayout from '../components/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Researcher rute
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
    // Admin rute
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../views/admin/AdminDashboardView.vue')
        },
        {
          path: 'instruments',
          name: 'admin-instruments',
          component: () => import('../views/admin/AdminInstrumentsView.vue')
        },
        {
          path: 'researchers',
          name: 'admin-researchers',
          component: () => import('../views/admin/AdminResearchersView.vue')
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('../views/admin/AdminCategoriesView.vue')
        },
        {
          path: 'facilities',
          name: 'admin-facilities',
          component: () => import('../views/admin/AdminFacilitiesView.vue')
        },
        {
          path: 'reservations',
          name: 'admin-reservations',
          component: () => import('../views/admin/AdminReservationsView.vue')
        },
      ]
    }
  ],
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('access') !== null
  const isAdmin = localStorage.getItem('admin') !== null

  if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'admin-login' })
  } else if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isLoggedIn && !isAdmin) {
    next({ name: 'home' })
  } else if (to.name === 'admin-login' && isAdmin) {
    next({ name: 'admin-instruments' })
  } else {
    next()
  }
})

export default router