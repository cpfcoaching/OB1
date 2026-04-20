import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/job-tracker',
    name: 'JobTracker',
    component: () => import('@/views/JobTracker.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/ai-matching',
    name: 'AIMatching',
    component: () => import('@/views/AIMatching.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/resume-builder',
    name: 'ResumeBuilder',
    component: () => import('@/views/ResumeBuilder.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/interview-prep',
    name: 'InterviewPrep',
    component: () => import('@/views/InterviewPrep.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/job-scraper',
    name: 'JobScraper',
    component: () => import('@/views/JobScraper.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/email-templates',
    name: 'EmailTemplates',
    component: () => import('@/views/EmailTemplates.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { user, isAuthenticated, initializeAuth } = useAuth()
  
  // Initialize auth on first route
  if (!user.value && to.meta.requiresAuth) {
    await initializeAuth()
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated.value) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
