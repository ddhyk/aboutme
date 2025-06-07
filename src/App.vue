<template>
  <div class="app" :class="{'no-sidebar': !showComponents}">
    <Sidebar v-if="showComponents && showSidebar"/>
    <div class="main-content" :class="{'home-view': !showComponents, 'full-width': !showSidebar || isAdminRoute}">
      <router-view />
    </div>
    <MusicPlayer v-if="showComponents && showMusicPlayer"/>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    MusicPlayer
  },
  data() {
    return {
      showComponents: true,
      showSidebar: true,        // 控制侧边栏显示
      showMusicPlayer: true,    // 控制音乐播放器显示
      isAdminRoute: false       // 是否是管理后台路由
    }
  },
  mounted() {
    // 检测是否是首页，首页不显示侧边栏和音乐播放器
    this.checkRoute();
    this.$router.afterEach(() => {
      this.checkRoute();
    });
  },
  methods: {
    checkRoute() {
      // 检查是否是管理后台路由
      this.isAdminRoute = this.$route.path.startsWith('/admin');
      
      // 如果是首页，不显示侧边栏和音乐播放器
      this.showComponents = this.$route.path !== '/';
      
      // 在这里处理关于页面和管理后台的特殊显示逻辑
      if (this.$route.path === '/about' || this.isAdminRoute) {
        this.showSidebar = false;
        this.showMusicPlayer = false;
      } else if (this.$route.path !== '/') {
        this.showSidebar = true;
        this.showMusicPlayer = true;
      }
    }
  }
}
</script>

<style>
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --accent-color: #9370DB;
  --accent-color-hover: #ff00ff;
  --danger-color: #ff4757;
  --success-color: #2ed573;
  --warning-color: #ffa502;
  --info-color: #70a1ff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  scroll-behavior: smooth;
  height: 100%;
}

body {
  overflow-x: hidden;
}

a {
  text-decoration: none;
  color: inherit;
}

.container {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.app {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  padding-bottom: 120px; /* 为音乐播放器留出空间 */
}

/* 首页内容应该居中且没有侧边栏边距 */
.no-sidebar .main-content {
  margin-left: 0;
  padding-bottom: 0; /* 首页不需要底部padding */
}

/* 首页特殊处理 */
.main-content.home-view {
  padding: 0;
  margin: 0;
}

@media (max-width: 991px) {
  .main-content {
    margin-left: 80px;
  }
  
  .no-sidebar .main-content {
    margin-left: 0;
  }
}

@media (max-width: 576px) {
  .container {
    width: 100%;
    padding: 0 15px;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* 通用动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

/* 通用按钮样式 - 对非首页生效 */
.app:not(.no-sidebar) button, 
.app:not(.no-sidebar) .btn:not(.home-container .btn) {
  cursor: pointer;
  border: none;
  outline: none;
  font-family: inherit;
}

.app:not(.no-sidebar) button:disabled, 
.app:not(.no-sidebar) .btn:not(.home-container .btn):disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 通用表单样式 */
input, textarea, select {
  font-family: inherit;
  font-size: 1rem;
  padding: 10px 15px;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #333;
  color: var(--text-primary);
  width: 100%;
  transition: all 0.3s ease;
}

input:focus, textarea:focus, select:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(147, 112, 219, 0.2);
  outline: none;
}

/* 通用卡片样式 */
.card {
  background-color: var(--bg-secondary);
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* 添加全宽样式 */
.main-content.full-width {
  width: 100%;
  margin-left: 0;
  padding-bottom: 0;  
}
</style> 