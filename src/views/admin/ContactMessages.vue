<template>
  <div class="contact-messages">
    <div class="page-header">
      <h1>联系留言</h1>
      <div class="header-actions">
        <div class="filter-dropdown">
          <select v-model="statusFilter">
            <option value="all">全部留言</option>
            <option value="unread">未读留言</option>
            <option value="replied">已回复</option>
          </select>
        </div>
        <button class="refresh-btn" @click="fetchMessages" :disabled="isLoading">
          <i class="fas fa-sync-alt" :class="{'fa-spin': isLoading}"></i>
        </button>
      </div>
    </div>

    <div class="message-list-container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>加载留言中...</p>
      </div>

      <div v-else-if="filteredMessages.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-comments"></i>
        </div>
        <p>暂无{{ statusFilter === 'unread' ? '未读' : statusFilter === 'replied' ? '已回复' : '' }}留言</p>
      </div>

      <div v-else class="message-list">
        <div 
          v-for="(message, index) in filteredMessages" 
          :key="message.id" 
          class="message-item"
          :class="{ 'unread': !message.isRead }"
        >
          <div class="message-content">
            <div class="message-header">
              <div class="message-title">
                <h3>{{ message.name }}</h3>
                <span v-if="!message.isRead" class="unread-badge">未读</span>
                <span v-if="message.isReplied" class="replied-badge">已回复</span>
              </div>
              <span class="message-date">{{ formatDate(message.date) }}</span>
            </div>
            
            <div class="message-info">
              <p><i class="fas fa-envelope"></i> {{ message.email }}</p>
              <p v-if="message.phone"><i class="fas fa-phone"></i> {{ message.phone }}</p>
            </div>
            
            <div class="message-text">{{ message.message }}</div>
            
            <div v-if="message.isReplied" class="reply-section">
              <div class="reply-header">
                <h4>我的回复</h4>
                <span>{{ formatDate(message.replyDate) }}</span>
              </div>
              <p class="reply-content">{{ message.replyContent }}</p>
            </div>
            
            <div v-if="!message.isReplied && showReplyForm[message.id]" class="reply-form">
              <textarea 
                v-model="replyContent" 
                placeholder="输入您的回复..."
                rows="3"
              ></textarea>
              <div class="form-actions">
                <button class="cancel-btn" @click="cancelReply(message.id)">取消</button>
                <button 
                  class="send-btn" 
                  @click="sendReply(message.id, index)"
                  :disabled="!replyContent.trim()"
                >
                  <i class="fas fa-paper-plane"></i> 发送回复
                </button>
              </div>
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
              v-if="!message.isReplied && !showReplyForm[message.id]" 
              class="reply-btn" 
              @click="openReplyForm(message.id)"
              title="回复"
            >
              <i class="fas fa-reply"></i>
            </button>
            <button 
              class="delete-btn" 
              @click="deleteMessage(message.id, index)"
              title="删除"
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
  name: 'ContactMessages',
  data() {
    return {
      messages: [],
      isLoading: false,
      statusFilter: 'all',
      showReplyForm: {},
      replyContent: ''
    }
  },
  computed: {
    filteredMessages() {
      if (this.statusFilter === 'all') {
        return this.messages;
      } else if (this.statusFilter === 'unread') {
        return this.messages.filter(msg => !msg.isRead);
      } else if (this.statusFilter === 'replied') {
        return this.messages.filter(msg => msg.isReplied);
      }
      return this.messages;
    }
  },
  created() {
    this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/admin/contact-messages', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        this.messages = response.data;
      } catch (error) {
        console.error('获取留言失败:', error);
        // 开发调试用示例数据
        this.messages = [
          {
            id: 1,
            name: '张三',
            email: 'zhangsan@example.com',
            phone: '13800138000',
            message: '您好，我对您的个人网站设计非常感兴趣，想咨询一下您是否接受商业项目合作？我需要一个企业官网，希望能与您详细交流。',
            date: new Date(Date.now() - 3600000),
            isRead: false,
            isReplied: false
          },
          {
            id: 2,
            name: '李四',
            email: 'lisi@example.com',
            phone: '13900139000',
            message: '你好，看了你的作品集，对你的作品风格很欣赏。我是一家初创公司的负责人，想邀请你加入我们的团队，请问你有兴趣吗？',
            date: new Date(Date.now() - 86400000),
            isRead: true,
            isReplied: true,
            replyDate: new Date(Date.now() - 43200000),
            replyContent: '您好，非常感谢您的邀请！我目前有一些时间可以考虑新的机会。请您能否提供更多关于贵公司和职位的详细信息？我很乐意进一步了解。期待您的回复！'
          },
          {
            id: 3,
            name: '王五',
            email: 'wangwu@example.com',
            phone: '',
            message: '你的博客文章写得很好，特别是关于前端性能优化的那篇，给了我很多启发。不知道你是否愿意分享一下你的学习经验？',
            date: new Date(Date.now() - 172800000),
            isRead: true,
            isReplied: false
          }
        ];
      } finally {
        this.isLoading = false;
      }
    },
    async markAsRead(messageId, index) {
      try {
        await axios.put(`/api/admin/contact-messages/${messageId}/read`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        // 更新本地消息状态
        this.messages[index].isRead = true;
      } catch (error) {
        console.error('标记留言已读失败:', error);
        // 开发调试时直接更新本地状态
        this.messages[index].isRead = true;
      }
    },
    openReplyForm(messageId) {
      this.replyContent = '';
      this.showReplyForm = { ...this.showReplyForm, [messageId]: true };
    },
    cancelReply(messageId) {
      this.showReplyForm = { ...this.showReplyForm, [messageId]: false };
    },
    async sendReply(messageId, index) {
      if (!this.replyContent.trim()) return;
      
      try {
        await axios.post(`/api/admin/contact-messages/${messageId}/reply`, {
          content: this.replyContent
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        
        // 更新本地消息状态
        this.messages[index].isReplied = true;
        this.messages[index].replyContent = this.replyContent;
        this.messages[index].replyDate = new Date();
        this.messages[index].isRead = true;
        
        // 关闭回复表单
        this.showReplyForm = { ...this.showReplyForm, [messageId]: false };
        this.replyContent = '';
      } catch (error) {
        console.error('回复留言失败:', error);
        
        // 开发调试时直接更新本地状态
        this.messages[index].isReplied = true;
        this.messages[index].replyContent = this.replyContent;
        this.messages[index].replyDate = new Date();
        this.messages[index].isRead = true;
        
        // 关闭回复表单
        this.showReplyForm = { ...this.showReplyForm, [messageId]: false };
        this.replyContent = '';
      }
    },
    async deleteMessage(messageId, index) {
      if (!confirm('确定要删除这条留言吗？删除后将无法恢复。')) return;
      
      try {
        await axios.delete(`/api/admin/contact-messages/${messageId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        // 从本地移除留言
        this.messages.splice(index, 1);
      } catch (error) {
        console.error('删除留言失败:', error);
        // 开发调试时直接从本地移除
        this.messages.splice(index, 1);
      }
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
.contact-messages {
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
  align-items: center;
}

.filter-dropdown select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  font-size: 0.9rem;
  cursor: pointer;
  color: #555;
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
  gap: 20px;
}

.message-item {
  display: flex;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 20px;
  transition: all 0.2s;
  position: relative;
  gap: 15px;
}

.message-item.unread {
  background-color: rgba(147, 112, 219, 0.05);
  border-left: 3px solid #9370DB;
}

.message-item:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.message-title h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.unread-badge {
  background-color: #9370DB;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.replied-badge {
  background-color: #2ed573;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.message-date {
  font-size: 0.85rem;
  color: #999;
}

.message-info {
  margin-bottom: 15px;
}

.message-info p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.message-info i {
  width: 20px;
  color: #9370DB;
  margin-right: 5px;
}

.message-text {
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
  border: 1px solid #eee;
}

.reply-section {
  background-color: #f0f8ff;
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
  border-left: 3px solid #70a1ff;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reply-header h4 {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
}

.reply-header span {
  font-size: 0.8rem;
  color: #999;
}

.reply-content {
  margin: 0;
  color: #444;
  line-height: 1.5;
}

.reply-form {
  margin-top: 15px;
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 15px;
  border: 1px solid #eee;
}

.reply-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
  font-family: inherit;
  font-size: 0.95rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  padding: 8px 15px;
  background-color: #f2f2f2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e6e6e6;
}

.send-btn {
  padding: 8px 15px;
  background-color: #9370DB;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.send-btn:hover:not(:disabled) {
  background-color: #8a60d9;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mark-read-btn,
.reply-btn,
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

.reply-btn {
  color: #70a1ff;
}

.reply-btn:hover {
  background-color: rgba(112, 161, 255, 0.15);
}

.delete-btn {
  color: #ff4757;
}

.delete-btn:hover {
  background-color: rgba(255, 71, 87, 0.15);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .contact-messages {
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
  
  .message-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .message-date {
    margin-left: 0;
  }
  
  .message-actions {
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 15px;
  }
}
</style> 