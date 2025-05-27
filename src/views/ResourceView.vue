<template>
  <div class="resource-container">
    <div class="resource-header">
      <div class="container">
        <h1 class="resource-title">学习资源</h1>
        <p class="resource-subtitle">精选各类优质学习资源，助力您的学习之旅</p>
      </div>
    </div>
    
    <div class="container main-content-area">
      <div class="resource-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-item', activeTab === tab.id ? 'active' : '']"
        >
          <i :class="['fas', tab.icon]"></i>
          <span>{{ tab.name }}</span>
        </div>
      </div>
      
      <div class="resource-content">
        <div v-for="tab in tabs" :key="tab.id" v-show="activeTab === tab.id">
          <div class="tab-header">
            <h2>{{ tab.name }}资源</h2>
            <div class="view-toggle">
              <button 
                @click="viewMode = 'grid'"
                :class="['view-btn', viewMode === 'grid' ? 'active' : '']"
              >
                <i class="fas fa-th-large"></i>
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="['view-btn', viewMode === 'list' ? 'active' : '']"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
          
          <div :class="['resources', viewMode === 'grid' ? 'grid-view' : 'list-view']">
            <div 
              v-for="resource in getResourcesByType(tab.id)" 
              :key="resource.id"
              class="resource-item card"
            >
              <div class="resource-icon" v-if="viewMode === 'grid'">
                <i :class="['fas', resource.icon]"></i>
              </div>
              <div class="resource-info">
                <h3>{{ resource.title }}</h3>
                <p>{{ resource.description }}</p>
                <div class="resource-meta">
                  <span class="resource-type">
                    <i :class="['fas', resource.typeIcon]"></i>
                    {{ resource.type }}
                  </span>
                  <span class="resource-level" :class="'level-' + resource.level">
                    {{ getLevelText(resource.level) }}
                  </span>
                </div>
              </div>
              <div class="resource-actions">
                <a :href="resource.link" target="_blank" class="btn">访问资源</a>
                <button @click="saveResource(resource)" class="save-btn">
                  <i class="fas fa-bookmark"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="saved-resources">
        <h2>我的收藏</h2>
        <div v-if="savedResources.length === 0" class="no-saved">
          <i class="fas fa-bookmark"></i>
          <p>您还没有收藏任何资源</p>
        </div>
        <div v-else class="saved-list">
          <div 
            v-for="resource in savedResources" 
            :key="resource.id"
            class="saved-item card"
          >
            <div class="saved-info">
              <h4>{{ resource.title }}</h4>
              <div class="saved-meta">
                <span class="resource-type">{{ resource.type }}</span>
                <span class="resource-level" :class="'level-' + resource.level">
                  {{ getLevelText(resource.level) }}
                </span>
              </div>
            </div>
            <div class="saved-actions">
              <a :href="resource.link" target="_blank" class="visit-btn">
                <i class="fas fa-external-link-alt"></i>
              </a>
              <button @click="removeSaved(resource.id)" class="remove-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourceView',
  data() {
    return {
      activeTab: 'docs',
      viewMode: 'grid',
      savedResources: [],
      tabs: [
        { id: 'docs', name: '文档', icon: 'fa-book' },
        { id: 'courses', name: '课程', icon: 'fa-graduation-cap' },
        { id: 'tools', name: '工具', icon: 'fa-tools' },
        { id: 'blogs', name: '博客', icon: 'fa-rss' },
        { id: 'videos', name: '视频', icon: 'fa-video' }
      ],
      resources: [
        {
          id: 1,
          title: 'Vue.js官方文档',
          description: 'Vue.js官方文档，包含详细的API说明、教程和示例代码。',
          type: '官方文档',
          typeIcon: 'fa-file-alt',
          level: 'all',
          link: 'https://cn.vuejs.org/',
          icon: 'fa-vuejs',
          category: 'docs'
        },
        {
          id: 2,
          title: 'MDN Web文档',
          description: 'Mozilla开发者网络提供的Web技术文档，包括HTML、CSS和JavaScript等。',
          type: '参考文档',
          typeIcon: 'fa-file-alt',
          level: 'all',
          link: 'https://developer.mozilla.org/zh-CN/',
          icon: 'fa-firefox-browser',
          category: 'docs'
        },
        {
          id: 3,
          title: 'React官方文档',
          description: 'React官方文档，包含详细的API说明、教程和示例代码。',
          type: '官方文档',
          typeIcon: 'fa-file-alt',
          level: 'all',
          link: 'https://zh-hans.reactjs.org/',
          icon: 'fa-react',
          category: 'docs'
        },
        {
          id: 4,
          title: 'JavaScript.info',
          description: '现代JavaScript教程，从基础到高级的完整指南。',
          type: '教程',
          typeIcon: 'fa-file-code',
          level: 'beginner',
          link: 'https://zh.javascript.info/',
          icon: 'fa-js',
          category: 'docs'
        },
        {
          id: 5,
          title: 'Node.js官方文档',
          description: 'Node.js官方文档，包含详细的API说明、教程和示例代码。',
          type: '官方文档',
          typeIcon: 'fa-file-alt',
          level: 'intermediate',
          link: 'https://nodejs.org/zh-cn/docs/',
          icon: 'fa-node-js',
          category: 'docs'
        },
        {
          id: 6,
          title: 'CSS-Tricks',
          description: 'CSS技巧和教程的集合，包含大量实用的CSS技巧和最佳实践。',
          type: '博客',
          typeIcon: 'fa-rss',
          level: 'intermediate',
          link: 'https://css-tricks.com/',
          icon: 'fa-css3-alt',
          category: 'blogs'
        },
        {
          id: 7,
          title: 'Vue Mastery',
          description: 'Vue.js视频教程网站，提供从入门到高级的Vue.js课程。',
          type: '视频课程',
          typeIcon: 'fa-video',
          level: 'beginner',
          link: 'https://www.vuemastery.com/',
          icon: 'fa-vuejs',
          category: 'courses'
        },
        {
          id: 8,
          title: 'Udemy - JavaScript从零到精通',
          description: 'Udemy上最受欢迎的JavaScript课程之一，从基础到高级的完整课程。',
          type: '视频课程',
          typeIcon: 'fa-video',
          level: 'beginner',
          link: 'https://www.udemy.com/',
          icon: 'fa-js',
          category: 'courses'
        },
        {
          id: 9,
          title: 'VS Code',
          description: '微软开发的免费开源代码编辑器，支持多种编程语言和框架。',
          type: '开发工具',
          typeIcon: 'fa-tools',
          level: 'all',
          link: 'https://code.visualstudio.com/',
          icon: 'fa-code',
          category: 'tools'
        },
        {
          id: 10,
          title: 'GitHub',
          description: '全球最大的代码托管平台，可以免费托管开源项目和私有项目。',
          type: '代码托管',
          typeIcon: 'fa-tools',
          level: 'all',
          link: 'https://github.com/',
          icon: 'fa-github',
          category: 'tools'
        },
        {
          id: 11,
          title: 'CodePen',
          description: '在线代码编辑器和社区，可以快速创建、分享和发现前端代码片段。',
          type: '在线工具',
          typeIcon: 'fa-tools',
          level: 'all',
          link: 'https://codepen.io/',
          icon: 'fa-codepen',
          category: 'tools'
        },
        {
          id: 12,
          title: 'YouTube - Traversy Media',
          description: '提供各种Web开发技术的视频教程，包括HTML、CSS、JavaScript、PHP等。',
          type: '视频教程',
          typeIcon: 'fa-video',
          level: 'beginner',
          link: 'https://www.youtube.com/c/TraversyMedia',
          icon: 'fa-youtube',
          category: 'videos'
        }
      ]
    }
  },
  mounted() {
    // 从localStorage加载已保存的资源
    const savedResources = localStorage.getItem('savedResources');
    if (savedResources) {
      this.savedResources = JSON.parse(savedResources);
    }
    
    // 从URL参数中获取活动标签
    const tab = this.$route.query.tab;
    if (tab && this.tabs.some(t => t.id === tab)) {
      this.activeTab = tab;
    }
  },
  methods: {
    getResourcesByType(type) {
      return this.resources.filter(resource => resource.category === type);
    },
    
    getLevelText(level) {
      const levels = {
        'beginner': '入门',
        'intermediate': '中级',
        'advanced': '高级',
        'all': '所有级别'
      };
      
      return levels[level] || '所有级别';
    },
    
    saveResource(resource) {
      if (!this.savedResources.some(r => r.id === resource.id)) {
        this.savedResources.push(resource);
        localStorage.setItem('savedResources', JSON.stringify(this.savedResources));
      }
    },
    
    removeSaved(id) {
      this.savedResources = this.savedResources.filter(r => r.id !== id);
      localStorage.setItem('savedResources', JSON.stringify(this.savedResources));
    }
  }
}
</script>

<style scoped>
.resource-container {
  padding-top: 30px;
}

.resource-header {
  background-color: var(--bg-secondary);
  padding: 60px 0;
  margin-bottom: 40px;
  text-align: center;
  border-radius: 10px;
}

.resource-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #9370DB, #ff00ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.resource-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
}

.main-content-area {
  padding: 20px 0 100px;
}

.resource-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.tab-item {
  padding: 12px 20px;
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tab-item:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.tab-item.active {
  background-color: var(--accent-color);
  color: white;
}

.tab-item i {
  font-size: 1.2rem;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.tab-header h2 {
  font-size: 1.8rem;
  color: var(--text-primary);
}

.view-toggle {
  display: flex;
  gap: 10px;
}

.view-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.view-btn.active {
  background-color: var(--accent-color);
  color: white;
}

.resources {
  margin-bottom: 50px;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.list-view .resource-item {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.resource-item {
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.resource-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.resource-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.resource-icon i {
  font-size: 1.8rem;
  color: white;
}

.resource-info {
  flex: 1;
}

.list-view .resource-info {
  padding-right: 20px;
}

.resource-item h3 {
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.resource-item p {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.resource-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.resource-type {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.resource-type i {
  color: var(--accent-color);
}

.resource-level {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.level-beginner {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.level-intermediate {
  background-color: rgba(255, 193, 7, 0.2);
  color: #FFC107;
}

.level-advanced {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.level-all {
  background-color: rgba(147, 112, 219, 0.2);
  color: #9370DB;
}

.resource-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.list-view .resource-actions {
  margin-top: 0;
}

.resource-actions .btn {
  flex: 1;
}

.save-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.save-btn:hover {
  color: var(--accent-color);
}

.saved-resources {
  margin-top: 50px;
}

.saved-resources h2 {
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: var(--text-primary);
  padding-bottom: 10px;
  border-bottom: 2px solid var(--accent-color);
  display: inline-block;
}

.no-saved {
  text-align: center;
  padding: 50px 0;
  color: var(--text-secondary);
}

.no-saved i {
  font-size: 3rem;
  margin-bottom: 20px;
}

.saved-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.saved-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.saved-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.saved-info {
  flex: 1;
}

.saved-info h4 {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.saved-meta {
  display: flex;
  gap: 10px;
}

.saved-actions {
  display: flex;
  gap: 8px;
}

.visit-btn, .remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.visit-btn {
  background-color: var(--accent-color);
  color: white;
}

.visit-btn:hover {
  background-color: var(--accent-hover);
}

.remove-btn {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
}

.remove-btn:hover {
  color: #F44336;
}

@media (max-width: 991px) {
  .tab-item {
    padding: 10px 15px;
  }
  
  .list-view .resource-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .list-view .resource-info {
    padding-right: 0;
  }
}

@media (max-width: 768px) {
  .resource-title {
    font-size: 2rem;
  }
  
  .resource-subtitle {
    font-size: 1rem;
  }
  
  .grid-view {
    grid-template-columns: 1fr;
  }
  
  .saved-list {
    grid-template-columns: 1fr;
  }
}
</style> 