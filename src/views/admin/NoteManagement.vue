<template>
  <div class="note-management">
    <div class="page-header">
      <h1>笔记管理</h1>
      <button class="add-btn" @click="openNoteModal(null)">
        <i class="fas fa-plus"></i> 添加笔记
      </button>
    </div>

    <div class="filter-bar">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索笔记..." 
          @input="filterNotes"
        >
      </div>
      <div class="filter-select">
        <label>分类:</label>
        <select v-model="categoryFilter" @change="filterNotes">
          <option value="all">全部分类</option>
          <option value="frontend">前端开发</option>
          <option value="backend">后端开发</option>
          <option value="ai">AI与机器学习</option>
          <option value="server">服务器运维</option>
        </select>
      </div>
    </div>

    <div class="note-list-container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>加载笔记中...</p>
      </div>
      
      <div v-else-if="filteredNotes.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-sticky-note"></i>
        </div>
        <p>没有找到笔记</p>
        <button class="add-btn" @click="openNoteModal(null)">
          <i class="fas fa-plus"></i> 添加第一篇笔记
        </button>
      </div>
      
      <div v-else class="note-list">
        <div 
          v-for="note in filteredNotes" 
          :key="note.id" 
          class="note-card"
        >
          <div class="note-category" :class="note.category">
            {{ getCategoryName(note.category) }}
          </div>
          <div class="note-content">
            <h3>{{ note.title }}</h3>
            <p class="note-excerpt">{{ note.excerpt }}</p>
            <div class="note-meta">
              <span class="note-date">{{ note.date }}</span>
              <div class="note-tags">
                <span 
                  v-for="(tag, index) in note.tags" 
                  :key="index" 
                  class="note-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <div class="note-actions">
            <a :href="note.link" target="_blank" class="action-btn view-btn" title="查看链接">
              <i class="fas fa-external-link-alt"></i>
            </a>
            <button class="action-btn edit-btn" @click="openNoteModal(note)" title="编辑">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" @click="confirmDeleteNote(note)" title="删除">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination" v-if="filteredNotes.length > 0">
      <button 
        class="pagination-btn" 
        @click="prevPage" 
        :disabled="currentPage === 1"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        class="pagination-btn" 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- 笔记编辑模态框 -->
    <div class="modal" v-if="showNoteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditMode ? '编辑笔记' : '添加笔记' }}</h2>
          <button class="close-btn" @click="closeNoteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="title">标题</label>
            <input 
              type="text" 
              id="title" 
              v-model="noteForm.title" 
              placeholder="输入笔记标题"
              required
            >
          </div>
          <div class="form-group">
            <label for="excerpt">简介</label>
            <textarea 
              id="excerpt" 
              v-model="noteForm.excerpt" 
              placeholder="输入笔记简介"
              rows="3"
              required
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label for="category">分类</label>
              <select id="category" v-model="noteForm.category" required>
                <option value="frontend">前端开发</option>
                <option value="backend">后端开发</option>
                <option value="ai">AI与机器学习</option>
                <option value="server">服务器运维</option>
              </select>
            </div>
            <div class="form-group half">
              <label for="date">日期</label>
              <input 
                type="date" 
                id="date" 
                v-model="noteForm.date" 
                required
              >
            </div>
          </div>
          <div class="form-group">
            <label for="link">链接</label>
            <input 
              type="url" 
              id="link" 
              v-model="noteForm.link" 
              placeholder="输入笔记链接"
              required
            >
          </div>
          <div class="form-group">
            <label for="tags">标签</label>
            <div class="tags-input">
              <input 
                type="text" 
                id="tagInput" 
                v-model="tagInput" 
                @keydown.enter.prevent="addTag"
                placeholder="添加标签后按回车"
              >
              <button class="add-tag-btn" @click.prevent="addTag" :disabled="!tagInput.trim()">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="selected-tags">
              <span 
                v-for="(tag, index) in noteForm.tags" 
                :key="index" 
                class="selected-tag"
              >
                {{ tag }}
                <button class="remove-tag-btn" @click="removeTag(index)">
                  <i class="fas fa-times"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeNoteModal">取消</button>
          <button class="save-btn" @click="saveNote" :disabled="!isFormValid">
            {{ isEditMode ? '保存修改' : '添加笔记' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 确认删除模态框 -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content delete-modal">
        <div class="modal-header">
          <h2>确认删除</h2>
          <button class="close-btn" @click="closeDeleteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>您确定要删除笔记 <strong>"{{ noteToDelete?.title }}"</strong> 吗？</p>
          <p class="warning-text">此操作不可逆，删除后无法恢复。</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeDeleteModal">取消</button>
          <button class="delete-confirm-btn" @click="deleteNote">
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NoteManagement',
  data() {
    return {
      notes: [],
      filteredNotes: [],
      isLoading: false,
      searchQuery: '',
      categoryFilter: 'all',
      currentPage: 1,
      itemsPerPage: 5,
      showNoteModal: false,
      showDeleteModal: false,
      isEditMode: false,
      noteToDelete: null,
      tagInput: '',
      noteForm: {
        id: null,
        title: '',
        excerpt: '',
        date: '',
        category: 'frontend',
        tags: [],
        link: ''
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredNotes.length / this.itemsPerPage);
    },
    paginatedNotes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNotes.slice(start, end);
    },
    isFormValid() {
      return (
        this.noteForm.title.trim() !== '' &&
        this.noteForm.excerpt.trim() !== '' &&
        this.noteForm.date !== '' &&
        this.noteForm.category !== '' &&
        this.noteForm.link.trim() !== ''
      );
    }
  },
  mounted() {
    this.fetchNotes();
  },
  methods: {
    async fetchNotes() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/admin/notes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        this.notes = response.data.notes;
        this.filterNotes();
      } catch (error) {
        console.error('获取笔记失败:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    filterNotes() {
      let result = [...this.notes];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(note => 
          note.title.toLowerCase().includes(query) || 
          note.excerpt.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // 分类过滤
      if (this.categoryFilter !== 'all') {
        result = result.filter(note => note.category === this.categoryFilter);
      }
      
      this.filteredNotes = result;
      this.currentPage = 1; // 重置到第一页
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    getCategoryName(categoryId) {
      const categories = {
        frontend: '前端开发',
        backend: '后端开发',
        ai: 'AI与机器学习',
        server: '服务器运维'
      };
      
      return categories[categoryId] || '未分类';
    },
    
    openNoteModal(note) {
      if (note) {
        // 编辑模式
        this.isEditMode = true;
        this.noteForm = {
          id: note.id,
          title: note.title,
          excerpt: note.excerpt,
          date: note.date,
          category: note.category,
          tags: [...note.tags],
          link: note.link
        };
      } else {
        // 添加模式
        this.isEditMode = false;
        this.noteForm = {
          id: null,
          title: '',
          excerpt: '',
          date: this.formatDate(new Date()),
          category: 'frontend',
          tags: [],
          link: ''
        };
      }
      
      this.showNoteModal = true;
    },
    
    closeNoteModal() {
      this.showNoteModal = false;
      this.noteForm = {
        id: null,
        title: '',
        excerpt: '',
        date: '',
        category: 'frontend',
        tags: [],
        link: ''
      };
      this.tagInput = '';
    },
    
    addTag() {
      const tag = this.tagInput.trim();
      if (tag && !this.noteForm.tags.includes(tag)) {
        this.noteForm.tags.push(tag);
      }
      this.tagInput = '';
    },
    
    removeTag(index) {
      this.noteForm.tags.splice(index, 1);
    },
    
    formatDate(date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    
    async saveNote() {
      if (!this.isFormValid) return;
      
      this.isLoading = true;
      
      try {
        if (this.isEditMode) {
          // 更新笔记
          await axios.put(`/api/admin/notes/${this.noteForm.id}`, this.noteForm, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          });
        } else {
          // 添加新笔记
          await axios.post('/api/admin/notes', this.noteForm, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          });
        }
        
        // 重新获取笔记列表
        await this.fetchNotes();
        this.closeNoteModal();
      } catch (error) {
        console.error(this.isEditMode ? '更新笔记失败:' : '添加笔记失败:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    confirmDeleteNote(note) {
      this.noteToDelete = note;
      this.showDeleteModal = true;
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.noteToDelete = null;
    },
    
    async deleteNote() {
      if (!this.noteToDelete) return;
      
      this.isLoading = true;
      
      try {
        await axios.delete(`/api/admin/notes/${this.noteToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        
        // 重新获取笔记列表
        await this.fetchNotes();
        this.closeDeleteModal();
      } catch (error) {
        console.error('删除笔记失败:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.note-management {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: 700px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

.page-header h1 {
  font-size: 1.8rem;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.add-btn {
  padding: 10px 18px;
  background: linear-gradient(135deg, #9370DB, #8A61D1);
  color: white;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  box-shadow: 0 3px 6px rgba(147, 112, 219, 0.2);
}

.add-btn:hover {
  background: linear-gradient(135deg, #8A61D1, #7752C7);
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(147, 112, 219, 0.3);
}

.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9370DB;
}

.search-box input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  background-color: white;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-box input:focus {
  border-color: #9370DB;
  box-shadow: 0 2px 8px rgba(147, 112, 219, 0.2);
  outline: none;
}

.filter-select {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-select label {
  color: #555;
  font-size: 1rem;
  font-weight: 500;
}

.filter-select select {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  min-width: 170px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-select select:focus {
  border-color: #9370DB;
  box-shadow: 0 2px 8px rgba(147, 112, 219, 0.2);
  outline: none;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  min-height: 300px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

.spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid rgba(147, 112, 219, 0.2);
  border-top-color: #9370DB;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 3.5rem;
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state p {
  color: #777;
  margin-bottom: 25px;
  font-size: 1.1rem;
}

.note-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.note-card {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
  border: 1px solid #eee;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.note-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.note-category {
  width: 10px;
  flex-shrink: 0;
}

.note-category.frontend {
  background: linear-gradient(to bottom, #9370DB, #8A61D1);
}

.note-category.backend {
  background: linear-gradient(to bottom, #4169E1, #3A5FD9);
}

.note-category.ai {
  background: linear-gradient(to bottom, #8A2BE2, #7A1BD2);
}

.note-category.server {
  background: linear-gradient(to bottom, #4682B4, #3672A4);
}

.note-content {
  flex: 1;
  padding: 25px;
}

.note-content h3 {
  margin: 0 0 12px 0;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
}

.note-excerpt {
  color: #555;
  margin: 0 0 18px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1rem;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.note-date {
  color: #888;
  font-size: 0.9rem;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.note-tag {
  padding: 4px 10px;
  background-color: rgba(147, 112, 219, 0.1);
  color: #9370DB;
  border-radius: 20px;
  font-size: 0.85rem;
}

.note-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 15px;
  background-color: #f5f5f5;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  color: #666;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-btn {
  color: #70a1ff;
}

.view-btn:hover {
  background-color: rgba(112, 161, 255, 0.1);
  color: #5A91FF;
  transform: translateY(-2px);
}

.edit-btn {
  color: #9370DB;
}

.edit-btn:hover {
  background-color: rgba(147, 112, 219, 0.1);
  color: #8A61D1;
  transform: translateY(-2px);
}

.delete-btn {
  color: #ff6b6b;
}

.delete-btn:hover {
  background-color: rgba(255, 107, 107, 0.1);
  color: #FF5252;
  transform: translateY(-2px);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.pagination-btn {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  font-size: 1.1rem;
  color: #555;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8f8f8;
  border-color: #9370DB;
  color: #9370DB;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #555;
  font-size: 1rem;
  font-weight: 500;
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  width: 100%;
  max-width: 650px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.delete-modal {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #777;
  cursor: pointer;
  transition: all 0.3s;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.modal-body {
  padding: 25px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 20px 25px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group.half {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #444;
  font-size: 1rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  background-color: white;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #9370DB;
  box-shadow: 0 2px 8px rgba(147, 112, 219, 0.2);
  outline: none;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #aaa;
}

.tags-input {
  display: flex;
  gap: 12px;
}

.add-tag-btn {
  padding: 0 18px;
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}

.add-tag-btn:hover:not(:disabled) {
  background-color: #e6e6e6;
  border-color: #ccc;
}

.add-tag-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: rgba(147, 112, 219, 0.1);
  color: #9370DB;
  border-radius: 20px;
  font-size: 0.9rem;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: #9370DB;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  font-size: 0.8rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: rgba(147, 112, 219, 0.1);
}

.remove-tag-btn:hover {
  background-color: rgba(147, 112, 219, 0.2);
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: 500;
}

.cancel-btn:hover {
  background-color: #e6e6e6;
  border-color: #ccc;
}

.save-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #9370DB, #8A61D1);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 3px 6px rgba(147, 112, 219, 0.2);
}

.save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #8A61D1, #7752C7);
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(147, 112, 219, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(135deg, #b8a6d9, #a593c7);
  box-shadow: none;
}

.delete-confirm-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 3px 6px rgba(255, 107, 107, 0.2);
}

.delete-confirm-btn:hover {
  background: linear-gradient(135deg, #ff5252, #ff3838);
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(255, 107, 107, 0.3);
}

.warning-text {
  color: #ff6b6b;
  font-size: 0.95rem;
  padding: 12px;
  background-color: rgba(255, 107, 107, 0.05);
  border-radius: 6px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-text::before {
  content: "\f06a";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .note-management {
    padding: 20px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .filter-bar {
    flex-direction: column;
    padding: 12px;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .filter-select select {
    width: 100%;
  }
  
  .note-card {
    flex-direction: column;
  }
  
  .note-category {
    width: auto;
    height: 8px;
  }
  
  .note-actions {
    flex-direction: row;
    justify-content: flex-end;
    padding: 15px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .modal-content {
    width: 90%;
  }
}
</style> 