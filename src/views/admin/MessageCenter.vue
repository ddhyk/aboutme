<template>
  <div class="message-center">
    <div class="page-header">
      <h1>消息中心</h1>
      <div class="header-actions">
        <button class="action-btn" @click="markAllAsRead" :disabled="unreadMessages.length === 0 || isLoading">
          <i class="fas fa-check-double"></i> 全部标为已读
        </button>
        <button class="refresh-btn" @click="fetchMessages" :disabled="isLoading">
          <i class="fas fa-sync-alt" :class="{'fa-spin': isLoading}"></i>
        </button>
      </div>
    </div>

    <div class="tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'unread' }"
        @click="activeTab = 'unread'"
      >
        未读消息
        <span class="badge" v-if="unreadMessages.length > 0">{{ unreadMessages.length }}</span>
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部消息
      </div>
    </div>

    <div class="message-list-container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>加载消息中...</p>
      </div>

      <div v-else-if="displayMessages.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <p>{{ activeTab === 'unread' ? '没有未读消息' : '没有消息' }}</p>
      </div>

      <div v-else class="message-list">
        <div 
          v-for="(message, index) in displayMessages" 
          :key="message.id" 
          class="message-item"
          :class="{ 'unread': !message.isRead }"
        >
          <div class="message-type-icon" :class="message.type">
            <i :class="getTypeIcon(message.type)"></i>
          </div>
          <div class="message-content">
            <div class="message-header">
              <h3>{{ message.title }}</h3>
              <span class="message-date">{{ formatDate(message.date) }}</span>
            </div>
            <p class="message-text">{{ message.content }}</p>
            <div v-if="message.link" class="message-link">
              <a :href="message.link" target="_blank">查看详情 <i class="fas fa-external-link-alt"></i></a>
            </div>
          </div>
          <div class="message-actions">
            <button 
              v-if="!message.isRead" 
              class="mark-read-btn" 
              @click="markAsRead(message.id, index)"
              title="标记为已读"
            >
              <i class="fas fa-check"></i>
            </button>
            <button 
              class="delete-btn" 
              @click="deleteMessage(message.id, index)"
              title="删除消息"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MessageCenter',
  data() {
    return {
      messages: [],
      isLoading: false,
      activeTab: 'unread'
    }
  },
  computed: {
    unreadMessages() {
      return this.messages.filter(msg => !msg.isRead);
    },
    displayMessages() {
      return this.activeTab === 'unread' 
        ? this.unreadMessages 
        : this.messages;
    }
  },
  created() {
    this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/admin/messages', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        this.messages = response.data;
      } catch (error) {
        console.error('获取消息失败:', error);
        // 开发调试用示例数据
        this.messages = [
          {
            id: 1,
            title: '新留言通知',
            content: '有用户在您的网站留下了新的留言，请及时查看并回复。',
            date: new Date(Date.now() - 3600000),
            isRead: false,
            type: 'message',
            link: null
          },
          {
            id: 2,
            title: '项目浏览量提醒',
            content: '您的项目"响应式电商网站设计"获得了较多的浏览，点击查看详情。',
            date: new Date(Date.now() - 86400000),
            isRead: false,
            type: 'notification',
            link: '/admin/projects'
          },
          {
            id: 3,
            title: '系统更新通知',
            content: '系统将在今晚22:00-23:00进行例行维护，期间后台可能无法访问。',
            date: new Date(Date.now() - 172800000),
            isRead: true,
            type: 'system',
            link: null
          }
        ];
      } finally {
        this.isLoading = false;
      }
    },
    async markAsRead(messageId, index) {
      try {
        await axios.put(`/api/admin/messages/${messageId}/read`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        // 更新本地消息状态
        this.messages[index].isRead = true;
      } catch (error) {
        console.error('标记消息已读失败:', error);
        // 开发调试时直接更新本地状态
        this.messages[index].isRead = true;
      }
    },
    async markAllAsRead() {
      try {
        await axios.put('/api/admin/messages/read-all', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        // 更新所有未读消息状态
        this.messages.forEach(msg => {
          msg.isRead = true;
        });
      } catch (error) {
        console.error('标记全部已读失败:', error);
        // 开发调试时直接更新本地状态
        this.messages.forEach(msg => {
          msg.isRead = true;
        });
      }
    },
    async deleteMessage(messageId, index) {
      if (!confirm('确定要删除这条消息吗？')) return;
      
      try {
        await axios.delete(`/api/admin/messages/${messageId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        // 从本地移除消息
        this.messages.splice(index, 1);
      } catch (error) {
        console.error('删除消息失败:', error);
        // 开发调试时直接从本地移除
        this.messages.splice(index, 1);
      }
    },
    getTypeIcon(type) {
      const icons = {
        message: 'fas fa-comment',
        notification: 'fas fa-bell',
        system: 'fas fa-cog',
        warning: 'fas fa-exclamation-triangle'
      };
      return icons[type] || 'fas fa-envelope';
    },
    formatDate(date) {
      if (!date) return '';
      
      const msgDate = new Date(date);
      const now = new Date();
      const diffMs = now - msgDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return `${diffMinutes} 分钟前`;
        }
        return `${diffHours} 小时前`;
      } else if (diffDays === 1) {
        return '昨天';
      } else if (diffDays < 7) {
        return `${diffDays} 天前`;
      } else {
        return `${msgDate.getFullYear()}-${msgDate.getMonth() + 1}-${msgDate.getDate()}`;
      }
    }
  }
}
</script>

<style scoped>
.message-center {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: 700px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 1.8rem;
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 15px;
  background-color: #f2f2f2;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  background-color: #e6e6e6;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #e6e6e6;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
}

.tab {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 1rem;
  position: relative;
  color: #666;
  transition: all 0.2s;
}

.tab:hover {
  color: #333;
}

.tab.active {
  color: #9370DB;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #9370DB;
}

.badge {
  background-color: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 5px;
  position: relative;
  top: -1px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #999;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid rgba(147, 112, 219, 0.2);
  border-top-color: #9370DB;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #999;
}

.empty-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 15px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-item {
  display: flex;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 20px;
  transition: all 0.2s;
  position: relative;
}

.message-item.unread {
  background-color: rgba(147, 112, 219, 0.05);
  border-left: 3px solid #9370DB;
}

.message-item:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.message-type-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
  font-size: 1.2rem;
}

.message-type-icon.message {
  background-color: rgba(112, 161, 255, 0.15);
  color: #70a1ff;
}

.message-type-icon.notification {
  background-color: rgba(255, 165, 2, 0.15);
  color: #ffa502;
}

.message-type-icon.system {
  background-color: rgba(46, 213, 115, 0.15);
  color: #2ed573;
}

.message-type-icon.warning {
  background-color: rgba(255, 71, 87, 0.15);
  color: #ff4757;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.message-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.message-date {
  font-size: 0.85rem;
  color: #999;
  margin-left: 10px;
}

.message-text {
  margin: 0;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}

.message-link a {
  color: #9370DB;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.message-link a:hover {
  text-decoration: underline;
}

.message-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 15px;
}

.mark-read-btn,
.delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: rgba(0, 0, 0, 0.05);
}

.mark-read-btn {
  color: #2ed573;
}

.mark-read-btn:hover {
  background-color: rgba(46, 213, 115, 0.15);
}

.delete-btn {
  color: #ff4757;
}

.delete-btn:hover {
  background-color: rgba(255, 71, 87, 0.15);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-center {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .message-item {
    flex-direction: column;
  }
  
  .message-type-icon {
    margin-bottom: 10px;
    margin-right: 0;
  }
  
  .message-header {
    flex-direction: column;
    gap: 5px;
  }
  
  .message-date {
    margin-left: 0;
  }
  
  .message-actions {
    flex-direction: row;
    margin-left: 0;
    margin-top: 15px;
    justify-content: flex-end;
  }
}
</style> 