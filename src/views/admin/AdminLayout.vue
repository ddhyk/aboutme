<template>
  <div class="admin-layout">
    <div v-if="isAuthenticated" class="admin-sidebar">
      <div class="admin-sidebar-header">
        <h2>后台管理</h2>
      </div>
      <div class="admin-menu">
        <router-link :to="{ name: 'admin-dashboard' }" class="menu-item">
          <i class="fas fa-tachometer-alt"></i> 控制面板
        </router-link>
        <router-link :to="{ name: 'admin-projects' }" class="menu-item">
          <i class="fas fa-project-diagram"></i> 项目管理
        </router-link>
        <router-link :to="{ name: 'admin-messages' }" class="menu-item">
          <i class="fas fa-envelope"></i> 消息中心
          <span class="unread-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
        </router-link>
        <router-link :to="{ name: 'admin-contact' }" class="menu-item">
          <i class="fas fa-comment-dots"></i> 联系留言
          <span class="unread-badge" v-if="unreadContactCount > 0">{{ unreadContactCount }}</span>
        </router-link>
        <router-link :to="{ name: 'admin-notes' }" class="menu-item">
          <i class="fas fa-sticky-note"></i> 笔记管理
        </router-link>
        <div class="menu-item logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i> 退出登录
        </div>
      </div>
    </div>
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminLayout',
  data() {
    return {
      isAuthenticated: false,
      unreadCount: 0,
      unreadContactCount: 0
    }
  },
  created() {
    this.checkAuth();
    if (this.isAuthenticated) {
      this.fetchUnreadCount();
    }
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('admin_token');
      this.isAuthenticated = !!token;
    },
    logout() {
      localStorage.removeItem('admin_token');
      this.$router.push({ name: 'admin-login' });
    },
    async fetchUnreadCount() {
      try {
        const response = await axios.get('/api/admin/messages/unread-count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        this.unreadCount = response.data.count;
      } catch (error) {
        console.error('获取未读消息数量失败:', error);
        // 假数据用于开发调试
        this.unreadCount = 3;
      }
    },
    async fetchUnreadContactCount() {
      try {
        const response = await axios.get('/api/admin/contact/unread-count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        this.unreadContactCount = response.data.count;
      } catch (error) {
        console.error('获取未读联系留言数量失败:', error);
        // 假数据用于开发调试
        this.unreadContactCount = 0;
      }
    }
  },
  watch: {
    $route() {
      this.checkAuth();
      if (this.isAuthenticated) {
        this.fetchUnreadCount();
        this.fetchUnreadContactCount();
      }
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
}

.admin-sidebar {
  width: 280px;
  background: linear-gradient(to bottom, #333 0%, #121212 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 0 15px rgba(0, 0, 0, 0.2);
  position: fixed;
  height: 100vh;
  z-index: 10;
}

.admin-sidebar-header {
  padding: 25px 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #444;
}

.admin-sidebar-header h2 {
  margin: 0;
  font-size: 1.6rem;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
}

.admin-menu {
  padding: 25px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  color: #e0e0e0;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
  font-size: 1.05rem;
  position: relative;
}

.menu-item i {
  margin-right: 15px;
  width: 22px;
  text-align: center;
  font-size: 1.1rem;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-left-color: rgba(147, 112, 219, 0.5);
}

.router-link-active {
  background-color: rgba(147, 112, 219, 0.2);
  color: #fff;
  border-left-color: #9370DB;
  font-weight: 500;
}

.unread-badge {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #ff6b6b;
  color: white;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0 6px;
  font-weight: bold;
}

.logout {
  margin-top: auto;
  border-top: 1px solid #444;
  color: #ff6b6b;
}

.logout:hover {
  background-color: rgba(255, 107, 107, 0.1);
  border-left-color: #ff6b6b;
}

.admin-content {
  flex: 1;
  margin-left: 280px;
  padding: 30px;
  overflow-y: auto;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 移动端适配 */
@media (max-width: 992px) {
  .admin-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .admin-content {
    margin-left: 0;
    min-height: 0;
  }
  
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-menu {
    padding: 10px 0;
  }
  
  .menu-item {
    padding: 12px 20px;
  }
  
  .admin-sidebar-header {
    padding: 15px;
  }
  
  .admin-sidebar-header h2 {
    font-size: 1.4rem;
  }
  
  .logout {
    margin-top: 0;
  }
}
</style> 