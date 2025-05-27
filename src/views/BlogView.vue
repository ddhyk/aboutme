<template>
  <div class="blog-container">
    <div class="welcome-section">
      <div class="container">
        <h1 class="welcome-title">网络学习笔记</h1>
        <p class="welcome-subtitle">记录前端、后端、服务器运维、AI等相关学习内容</p>
      </div>
    </div>
    
    <div class="container main-content-area">
      <div class="features-section">
        <div class="row">
          <div class="col-4 feature-card">
            <div class="card">
              <div class="feature-icon">
                <i class="fas fa-code"></i>
              </div>
              <h3>前端开发</h3>
              <p>包括HTML、CSS、JavaScript、Vue、React等前端技术栈的学习笔记。</p>
              <router-link to="/notes?category=frontend" class="btn">查看笔记</router-link>
            </div>
          </div>
          
          <div class="col-4 feature-card">
            <div class="card">
              <div class="feature-icon">
                <i class="fas fa-server"></i>
              </div>
              <h3>后端开发</h3>
              <p>包括Node.js、Python、Java、数据库等后端技术的学习笔记。</p>
              <router-link to="/notes?category=backend" class="btn">查看笔记</router-link>
            </div>
          </div>
          
          <div class="col-4 feature-card">
            <div class="card">
              <div class="feature-icon">
                <i class="fas fa-robot"></i>
              </div>
              <h3>AI与机器学习</h3>
              <p>包括人工智能、机器学习、深度学习等相关技术的学习笔记。</p>
              <router-link to="/notes?category=ai" class="btn">查看笔记</router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div class="recent-posts">
        <h2>最近更新</h2>
        <div class="row">
          <div class="col-6" v-for="(post, index) in recentPosts" :key="index">
            <div class="card post-card">
              <div class="post-date">{{ post.date }}</div>
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
              <router-link :to="post.link" class="read-more">阅读更多 <i class="fas fa-arrow-right"></i></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogView',
  data() {
    return {
      recentPosts: [
        {
          title: 'Vue 3组合式API详解',
          excerpt: 'Vue 3的组合式API（Composition API）是Vue 3的一大特色，它允许我们使用函数式的方式组织组件逻辑，提高代码的可复用性和可维护性。',
          date: '2023-06-15',
          link: '/notes/vue3-composition-api'
        },
        {
          title: 'Node.js异步编程最佳实践',
          excerpt: 'Node.js的异步编程模型是其核心特性之一，掌握异步编程的最佳实践对于开发高性能的Node.js应用至关重要。',
          date: '2023-06-10',
          link: '/notes/nodejs-async-programming'
        },
        {
          title: 'CSS Grid布局完全指南',
          excerpt: 'CSS Grid是一种强大的二维布局系统，它可以帮助我们创建复杂的网页布局，本文将详细介绍CSS Grid的使用方法和技巧。',
          date: '2023-06-05',
          link: '/notes/css-grid-guide'
        },
        {
          title: '深入理解JavaScript原型链',
          excerpt: '原型链是JavaScript中重要的概念，理解原型链对于掌握JavaScript的面向对象编程至关重要。',
          date: '2023-05-30',
          link: '/notes/javascript-prototype-chain'
        }
      ]
    }
  }
}
</script>

<style scoped>
.blog-container {
  padding-top: 30px;
}

.welcome-section {
  background-color: var(--bg-secondary);
  padding: 60px 0;
  margin-bottom: 40px;
  text-align: center;
  border-radius: 10px;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #9370DB, #ff00ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
}

.main-content-area {
  padding: 20px 0 100px;
}

.features-section {
  margin-bottom: 60px;
}

.feature-card {
  margin-bottom: 30px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--accent-color);
  margin-bottom: 15px;
  text-align: center;
}

.feature-card h3 {
  margin-bottom: 15px;
  color: var(--text-primary);
  font-size: 1.4rem;
  text-align: center;
}

.feature-card p {
  color: var(--text-secondary);
  margin-bottom: 20px;
  text-align: center;
}

.feature-card .btn {
  display: block;
  text-align: center;
  margin: 0 auto;
  width: 120px;
}

.recent-posts h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--accent-color);
  display: inline-block;
}

.post-card {
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.post-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.post-card h3 {
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.post-card p {
  color: var(--text-secondary);
  margin-bottom: 15px;
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

@media (max-width: 991px) {
  .col-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .col-4, .col-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style> 