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

// 添加导航守卫，检查是否来自首页
router.beforeEach((to, from, next) => {
  console.log('导航到:', to.path, '来自:', from.path);
  next();
});

export default router 