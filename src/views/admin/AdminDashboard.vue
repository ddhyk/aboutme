<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>控制面板</h1>
      <div class="last-updated">
        上次更新: {{ lastUpdated }}
        <button class="refresh-btn" @click="fetchDashboardData" title="刷新数据">
          <i class="fas fa-sync-alt" :class="{'fa-spin': isLoading}"></i>
        </button>
      </div>
    </div>
    
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-project-diagram"></i>
        </div>
        <div class="stat-content">
          <h3>项目数量</h3>
          <p class="stat-value">{{ stats.projectCount || 0 }}</p>
          <div class="stat-trend">
            <i class="fas fa-arrow-up"></i> 较上月增长 5%
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon views-icon">
          <i class="fas fa-eye"></i>
        </div>
        <div class="stat-content">
          <h3>总浏览量</h3>
          <p class="stat-value">{{ stats.totalViews || 0 }}</p>
          <div class="stat-trend">
            <i class="fas fa-arrow-up"></i> 较上周增长 12%
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon messages-icon">
          <i class="fas fa-envelope"></i>
        </div>
        <div class="stat-content">
          <h3>未读消息</h3>
          <p class="stat-value">{{ stats.unreadMessages || 0 }}</p>
          <div class="stat-trend" v-if="stats.unreadMessages > 0">
            <router-link :to="{ name: 'admin-messages' }" class="view-all">查看全部</router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-sections">
      <div class="recent-section">
        <div class="section-header">
          <h2>最近添加的项目</h2>
          <router-link :to="{ name: 'admin-projects' }" class="view-all-link">
            查看全部 <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        
        <div v-if="isLoading" class="loading">
          <div class="spinner"></div>
          <p>加载中，请稍候...</p>
        </div>
        
        <div v-else-if="recentProjects.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-folder-open"></i>
          </div>
          <p>暂无项目数据</p>
          <router-link :to="{ name: 'admin-projects' }" class="add-new-btn">
            <i class="fas fa-plus"></i> 添加新项目
          </router-link>
        </div>
        
        <div v-else class="recent-projects">
          <div v-for="(project, index) in recentProjects" :key="index" class="recent-project-item">
            <img :src="project.image" :alt="project.title" class="project-thumbnail">
            <div class="project-info">
              <h3>{{ project.title }}</h3>
              <p class="project-date">{{ project.date }}</p>
            </div>
            <router-link :to="{ name: 'admin-projects' }" class="edit-btn">
              编辑 <i class="fas fa-chevron-right"></i>
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <div class="section-header">
          <h2>快捷操作</h2>
        </div>
        <div class="actions-grid">
          <router-link :to="{ name: 'admin-projects' }" class="action-card">
            <div class="action-icon">
              <i class="fas fa-plus"></i>
            </div>
            <h3>添加项目</h3>
          </router-link>
          
          <router-link :to="{ name: 'admin-messages' }" class="action-card">
            <div class="action-icon" :class="{'highlight': stats.unreadMessages > 0}">
              <i class="fas fa-envelope"></i>
              <span v-if="stats.unreadMessages > 0" class="count-badge">{{ stats.unreadMessages }}</span>
            </div>
            <h3>消息中心</h3>
          </router-link>
          
          <router-link :to="{ name: 'admin-contact' }" class="action-card">
            <div class="action-icon" :class="{'highlight': stats.unreadContacts > 0}">
              <i class="fas fa-comment-dots"></i>
              <span v-if="stats.unreadContacts > 0" class="count-badge">{{ stats.unreadContacts }}</span>
            </div>
            <h3>联系留言</h3>
          </router-link>
          
          <router-link :to="{ name: 'admin-notes' }" class="action-card">
            <div class="action-icon">
              <i class="fas fa-sticky-note"></i>
            </div>
            <h3>笔记管理</h3>
          </router-link>
          
          <div class="action-card">
            <div class="action-icon">
              <i class="fas fa-cog"></i>
            </div>
            <h3>系统设置</h3>
          </div>
          
          <div class="action-card">
            <div class="action-icon">
              <i class="fas fa-question-circle"></i>
            </div>
            <h3>帮助中心</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      isLoading: true,
      stats: {
        projectCount: 0,
        totalViews: 0,
        unreadMessages: 0,
        unreadContacts: 0
      },
      recentProjects: [],
      lastUpdated: ''
    }
  },
  async created() {
    await this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      this.isLoading = true;
      try {
        // 获取仪表盘数据
        const response = await axios.get('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        
        this.stats = response.data.stats;
        this.recentProjects = response.data.recentProjects;
        this.updateLastUpdatedTime();
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
        // 使用假数据（开发调试用）
        this.stats = {
          projectCount: 4,
          totalViews: 1250,
          unreadMessages: 3,
          unreadContacts: 2
        };
        this.recentProjects = [
          {
            title: "AI智能客服系统",
            image: "https://via.placeholder.com/300x200?text=AI客服系统",
            date: "2023年3月"
          },
          {
            title: "企业数据分析平台",
            image: "https://via.placeholder.com/300x200?text=数据分析平台",
            date: "2022年11月"
          }
        ];
        this.updateLastUpdatedTime();
      } finally {
        this.isLoading = false;
      }
    },
    updateLastUpdatedTime() {
      const now = new Date();
      const formatNumber = (num) => num < 10 ? `0${num}` : num;
      this.lastUpdated = `${now.getFullYear()}-${formatNumber(now.getMonth() + 1)}-${formatNumber(now.getDate())} ${formatNumber(now.getHours())}:${formatNumber(now.getMinutes())}`;
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
  color: #333;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
}

.last-updated {
  font-size: 0.9rem;
  color: #777;
  display: flex;
  align-items: center;
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9370DB;
  font-size: 1rem;
  margin-left: 10px;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  color: #7F5BC0;
  transform: rotate(45deg);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: rgba(147, 112, 219, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  transition: all 0.3s ease;
}

.views-icon {
  background-color: rgba(100, 180, 255, 0.15);
}

.messages-icon {
  background-color: rgba(255, 107, 107, 0.15);
}

.stat-icon i {
  font-size: 1.8rem;
  color: #9370DB;
}

.views-icon i {
  color: #64b4ff;
}

.messages-icon i {
  color: #ff6b6b;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #777;
  font-weight: 500;
}

.stat-value {
  margin: 0 0 10px 0;
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stat-trend {
  font-size: 0.85rem;
  color: #28a745;
  display: flex;
  align-items: center;
}

.stat-trend i {
  margin-right: 5px;
}

.view-all {
  color: #9370DB;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-all:hover {
  color: #7F5BC0;
  text-decoration: underline;
}

.dashboard-sections {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}

.recent-section, .quick-actions {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eaeaea;
}

.section-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
}

.view-all-link {
  color: #9370DB;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.view-all-link:hover {
  color: #7F5BC0;
}

.view-all-link i {
  margin-left: 5px;
  font-size: 0.8rem;
}

.loading, .empty-state {
  padding: 40px 25px;
  text-align: center;
  color: #777;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(147, 112, 219, 0.3);
  border-radius: 50%;
  border-top-color: #9370DB;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 15px;
}

.empty-state p {
  margin-bottom: 20px;
}

.add-new-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #9370DB;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.add-new-btn:hover {
  background-color: #7F5BC0;
  transform: translateY(-2px);
}

.add-new-btn i {
  margin-right: 8px;
}

.recent-projects {
  padding: 0 25px;
}

.recent-project-item {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eaeaea;
}

.recent-project-item:last-child {
  border-bottom: none;
}

.project-thumbnail {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.project-info {
  flex: 1;
}

.project-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.project-date {
  margin: 0;
  font-size: 0.9rem;
  color: #888;
}

.edit-btn {
  padding: 8px 15px;
  background-color: #f5f5f5;
  border-radius: 6px;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.edit-btn:hover {
  background-color: #e5e5e5;
  color: #333;
}

.edit-btn i {
  margin-left: 5px;
  font-size: 0.7rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 25px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  border: 1px solid #eaeaea;
}

.action-card:hover {
  background-color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-color: #9370DB;
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: rgba(147, 112, 219, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.action-icon i {
  font-size: 1.5rem;
  color: #9370DB;
}

.action-card h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .dashboard-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .last-updated {
    margin-top: 10px;
  }
  
  .project-thumbnail {
    width: 50px;
    height: 50px;
  }
}

.action-icon.highlight {
  background-color: rgba(255, 107, 107, 0.15);
  animation: pulse 2s infinite;
}

.action-icon .count-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff6b6b;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
  }
}
</style> 