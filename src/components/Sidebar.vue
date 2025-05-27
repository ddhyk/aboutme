<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <img src="/images/logo-1.png" alt="Logo">
      <span class="logo-text">智技仓</span>
    </div>

    <div class="nav-section">
      <div class="nav-title">主要导航</div>
      <ul class="nav-links">
        <li class="nav-item" :class="{ active: isActive('/blog') }">
          <router-link to="/blog">
            <i class="fas fa-home"></i>
            <span>首页概览</span>
          </router-link>
        </li>
        <li class="nav-item" :class="{ active: isActive('/notes') }">
          <router-link to="/notes">
            <i class="fas fa-book"></i>
            <span>学习笔记</span>
          </router-link>
        </li>
        <li class="nav-item" :class="{ active: isActive('/code') }">
          <router-link to="/code">
            <i class="fas fa-code"></i>
            <span>代码项目</span>
          </router-link>
        </li>
        <li class="nav-item" :class="{ active: isActive('/docs') }">
          <router-link to="/docs">
            <i class="fas fa-file-alt"></i>
            <span>文档资料</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="nav-section">
      <div class="nav-title">分类</div>
      <ul class="nav-links">
        <li class="nav-item" :class="{ active: isActive('/programming') }">
          <router-link to="/programming">
            <i class="fas fa-laptop-code"></i>
            <span>编程开发</span>
          </router-link>
        </li>
        <li class="nav-item" :class="{ active: isActive('/server') }">
          <router-link to="/server">
            <i class="fas fa-server"></i>
            <span>服务器运维</span>
          </router-link>
        </li>
        <li class="nav-item" :class="{ active: isActive('/mobile') }">
          <router-link to="/mobile">
            <i class="fas fa-mobile-alt"></i>
            <span>移动应用</span>
          </router-link>
        </li>
        <li class="nav-item" :class="{ active: isActive('/ai') }">
          <router-link to="/ai">
            <i class="fas fa-robot"></i>
            <span>人工智能</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="nav-section">
      <div class="nav-title">工具</div>
      <ul class="nav-links">
        <li class="nav-item" :class="{ active: isActive('/settings') }">
          <router-link to="/settings">
            <i class="fas fa-cog"></i>
            <span>设置</span>
          </router-link>
        </li>
        <li class="nav-item" :class="{ active: isActive('/help') }">
          <router-link to="/help">
            <i class="fas fa-question-circle"></i>
            <span>帮助中心</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    isActive(path) {
      return this.$route.path === path;
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: rgba(20, 25, 35, 0.8);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.sidebar-logo {
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.sidebar-logo img {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
}

.logo-text {
  font-weight: bold;
  font-size: 1.2rem;
  background: var(--gradient-blue-purple);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-title {
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding: 0 20px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item a {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  background-color: rgba(79, 195, 247, 0.15);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: var(--gradient-blue-purple);
}

.nav-item i {
  margin-right: 15px;
  font-size: 1.1rem;
  width: 20px;
  color: var(--text-secondary);
}

.nav-item.active i, 
.nav-item:hover i {
  color: var(--accent-blue);
}

/* 响应式设计 */
@media (max-width: 991px) {
  .sidebar {
    width: 80px;
    overflow: visible;
  }

  .logo-text, .nav-title, .nav-item span {
    display: none;
  }

  .nav-item i {
    margin-right: 0;
    font-size: 1.3rem;
  }

  .sidebar-logo {
    justify-content: center;
  }

  .sidebar-logo img {
    margin-right: 0;
  }
}
</style> 