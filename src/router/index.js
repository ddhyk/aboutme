import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue')
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('../views/NotesView.vue')
  },
  {
    path: '/resource',
    name: 'resource',
    component: () => import('../views/ResourceView.vue')
  },
  {
    path: '/ai',
    name: 'ai',
    component: () => import('../views/AIView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  // 后台管理路由
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'admin-login' }
      },
      {
        path: 'login',
        name: 'admin-login',
        component: () => import('../views/admin/AdminLogin.vue')
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import('../views/admin/ProjectManagement.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'messages',
        name: 'admin-messages',
        component: () => import('../views/admin/MessageCenter.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'contact',
        name: 'admin-contact',
        component: () => import('../views/admin/ContactMessages.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'notes',
        name: 'admin-notes',
        component: () => import('../views/admin/NoteManagement.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  // 捕获所有未匹配的路由，重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

// 添加导航守卫，检查权限
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    const isAuthenticated = localStorage.getItem('admin_token');
    if (!isAuthenticated) {
      // 未登录，重定向到登录页
      next({ name: 'admin-login', query: { redirect: to.fullPath } });
      return;
    }
  }
  next();
});

export default router 