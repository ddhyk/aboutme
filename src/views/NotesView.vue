<template>
  <div class="notes-container">
    <div class="notes-header">
      <div class="container">
        <h1 class="notes-title">学习笔记</h1>
        <div class="search-container">
          <div class="search-input">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="搜索笔记..." 
              @input="searchNotes"
            >
          </div>
          <div class="filter-tags">
            <span 
              v-for="tag in tags" 
              :key="tag" 
              @click="toggleTag(tag)" 
              :class="['filter-tag', selectedTags.includes(tag) ? 'active' : '']"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container notes-content">
      <div class="notes-sidebar">
        <div class="category-filters">
          <h3>分类</h3>
          <ul>
            <li 
              v-for="category in categories" 
              :key="category.id"
              @click="setActiveCategory(category.id)"
              :class="{ active: activeCategory === category.id }"
            >
              <i :class="['fas', category.icon]"></i>
              <span>{{ category.name }}</span>
              <span class="count">{{ category.count }}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="notes-main">
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>加载中...</span>
        </div>
        
        <div v-else-if="filteredNotes.length === 0" class="no-results">
          <i class="fas fa-exclamation-circle"></i>
          <p>没有找到匹配的笔记</p>
          <button @click="resetFilters" class="btn">重置筛选器</button>
        </div>
        
        <div v-else class="notes-grid">
          <div 
            v-for="note in filteredNotes" 
            :key="note.id" 
            class="note-card card"
          >
            <div class="note-category" :style="{ backgroundColor: getCategoryColor(note.category) }">
              {{ getCategoryName(note.category) }}
            </div>
            <h3>{{ note.title }}</h3>
            <p>{{ note.excerpt }}</p>
            <div class="note-meta">
              <span class="note-date">{{ note.date }}</span>
              <div class="note-tags">
                <span 
                  v-for="tag in note.tags" 
                  :key="tag" 
                  class="note-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <router-link :to="note.link" class="read-more">
              阅读全文 <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
        
        <div class="pagination" v-if="filteredNotes.length > 0">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NotesView',
  data() {
    return {
      searchQuery: '',
      selectedTags: [],
      activeCategory: 'all',
      currentPage: 1,
      itemsPerPage: 6,
      loading: false,
      notes: [],
      tags: [],
      categories: [
        { id: 'all', name: '全部笔记', icon: 'fa-clipboard-list', count: 0 },
        { id: 'frontend', name: '前端开发', icon: 'fa-code', count: 0 },
        { id: 'backend', name: '后端开发', icon: 'fa-server', count: 0 },
        { id: 'ai', name: 'AI与机器学习', icon: 'fa-robot', count: 0 },
        { id: 'server', name: '服务器运维', icon: 'fa-hdd', count: 0 }
      ]
    }
  },
  computed: {
    filteredNotes() {
      let result = [...this.notes];
      
      // 根据分类筛选
      if (this.activeCategory !== 'all') {
        result = result.filter(note => note.category === this.activeCategory);
      }
      
      // 根据标签筛选
      if (this.selectedTags.length > 0) {
        result = result.filter(note => 
          this.selectedTags.every(tag => note.tags.includes(tag))
        );
      }
      
      // 根据搜索词筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(note => 
          note.title.toLowerCase().includes(query) || 
          note.excerpt.toLowerCase().includes(query)
        );
      }
      
      // 分页处理
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      return result.slice(startIndex, endIndex);
    },
    totalPages() {
      let result = [...this.notes];
      
      // 根据分类筛选
      if (this.activeCategory !== 'all') {
        result = result.filter(note => note.category === this.activeCategory);
      }
      
      // 根据标签筛选
      if (this.selectedTags.length > 0) {
        result = result.filter(note => 
          this.selectedTags.every(tag => note.tags.includes(tag))
        );
      }
      
      // 根据搜索词筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(note => 
          note.title.toLowerCase().includes(query) || 
          note.excerpt.toLowerCase().includes(query)
        );
      }
      
      return Math.ceil(result.length / this.itemsPerPage);
    }
  },
  mounted() {
    // 从URL获取初始分类
    const category = this.$route.query.category;
    if (category && this.categories.some(c => c.id === category)) {
      this.activeCategory = category;
    }
    
    // 获取笔记数据
    this.fetchNotes();
  },
  methods: {
    async fetchNotes() {
      this.loading = true;
      try {
        // 获取笔记列表
        const response = await axios.get('/api/notes');
        this.notes = response.data.notes;
        
        // 获取所有标签
        const allTags = new Set();
        this.notes.forEach(note => {
          note.tags.forEach(tag => allTags.add(tag));
        });
        this.tags = Array.from(allTags);
        
        // 更新分类数量
        this.updateCategoryCount();
      } catch (error) {
        console.error('获取笔记数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    updateCategoryCount() {
      // 更新各分类的笔记数量
      const categoryCounts = {
        all: this.notes.length
      };
      
      this.notes.forEach(note => {
        if (!categoryCounts[note.category]) {
          categoryCounts[note.category] = 0;
        }
        categoryCounts[note.category]++;
      });
      
      // 更新分类计数
      this.categories.forEach(category => {
        category.count = categoryCounts[category.id] || 0;
      });
    },
    
    searchNotes() {
      this.currentPage = 1; // 重置到第一页
    },
    
    toggleTag(tag) {
      if (this.selectedTags.includes(tag)) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
      } else {
        this.selectedTags.push(tag);
      }
      this.currentPage = 1; // 重置到第一页
    },
    
    setActiveCategory(categoryId) {
      this.activeCategory = categoryId;
      this.currentPage = 1; // 重置到第一页
    },
    
    resetFilters() {
      this.searchQuery = '';
      this.selectedTags = [];
      this.activeCategory = 'all';
      this.currentPage = 1;
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
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : '';
    },
    
    getCategoryColor(categoryId) {
      const colors = {
        frontend: '#9370DB',
        backend: '#4169E1',
        ai: '#8A2BE2',
        server: '#4682B4'
      };
      
      return colors[categoryId] || '#9370DB';
    }
  }
}
</script>

<style scoped>
.notes-container {
  padding-top: 30px;
  min-height: 100vh;
}

.notes-header {
  background-color: var(--bg-secondary);
  padding: 40px 0;
  margin-bottom: 30px;
  border-radius: 10px;
}

.notes-title {
  font-size: 2.2rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #9370DB, #ff00ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 800px;
}

.search-input {
  position: relative;
}

.search-input i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: none;
  border-radius: 8px;
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  font-size: 1rem;
}

.search-input input:focus {
  outline: 2px solid var(--accent-color);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-tag {
  padding: 5px 12px;
  border-radius: 20px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  background-color: rgba(147, 112, 219, 0.2);
  color: var(--text-primary);
}

.filter-tag.active {
  background-color: var(--accent-color);
  color: white;
}

.notes-content {
  display: flex;
  gap: 30px;
  margin-bottom: 50px;
}

.notes-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.category-filters {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.category-filters h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--text-primary);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.category-filters ul {
  list-style: none;
}

.category-filters li {
  padding: 10px 15px;
  margin-bottom: 5px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.category-filters li:hover {
  background-color: var(--bg-tertiary);
}

.category-filters li.active {
  background-color: var(--accent-color);
  color: white;
}

.category-filters li i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.category-filters li .count {
  margin-left: auto;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.category-filters li.active .count {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.notes-main {
  flex: 1;
}

.loading, .no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: var(--text-secondary);
}

.loading i, .no-results i {
  font-size: 3rem;
  margin-bottom: 20px;
}

.no-results p {
  margin-bottom: 20px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.note-card {
  position: relative;
  padding-top: 40px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.note-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.note-category {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px 15px;
  border-radius: 4px 0 4px 0;
  font-size: 0.8rem;
  color: white;
}

.note-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.note-card p {
  color: var(--text-secondary);
  margin-bottom: 15px;
  min-height: 4.8em; /* 约3行文本高度 */
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.note-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.note-tag {
  padding: 2px 8px;
  border-radius: 4px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.read-more {
  color: var(--accent-color);
  font-weight: bold;
  display: inline-flex;
  align-items: center;
}

.read-more i {
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.read-more:hover i {
  transform: translateX(5px);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--accent-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-secondary);
}

@media (max-width: 991px) {
  .notes-content {
    flex-direction: column;
  }
  
  .notes-sidebar {
    width: 100%;
  }
  
  .category-filters ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .category-filters li {
    flex: 1;
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .notes-grid {
    grid-template-columns: 1fr;
  }
  
  .notes-title {
    font-size: 1.8rem;
  }
}
</style> 