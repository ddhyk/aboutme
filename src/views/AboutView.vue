<template>
  <div class="about-container">
    <!-- 顶部个人介绍区域 -->
    <div class="hero-section">
      <div class="hero-particles">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
      </div>
      
      <div class="container">
        <div class="hero-content">
          <div class="title-container">
            <div class="title-decoration"></div>
            <h1 class="main-title">
              <span class="primary-role">AI产品经理</span>
              <span class="title-separator">&</span>
              <span class="secondary-role">全栈开发爱好者</span>
            </h1>
            
            <div class="amateur-roles">
              <div class="amateur-roles-wrapper">
                <div class="minor-role design-role">
                  <i class="fas fa-paint-brush role-icon"></i>
                  <span>设计玩家</span>
                </div>
                <div class="minor-role photo-role">
                  <i class="fas fa-camera role-icon"></i>
                  <span>摄影师</span>
                </div>
                <div class="minor-role video-role">
                  <i class="fas fa-film role-icon"></i>
                  <span>剪辑师</span>
                </div>
                <div class="minor-role effect-role">
                  <i class="fas fa-magic role-icon"></i>
                  <span>特效玩家</span>
                </div>
                <div class="minor-role rpa-role">
                  <i class="fas fa-robot role-icon"></i>
                  <span>影刀RPA中级开发者</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-area">
          <div class="profile-image-container">
            <div class="profile-circle"></div>
            <div class="profile-image">
              <img src="/src/assets/images/logo11.png" alt="个人头像">
            </div>
            <div class="profile-overlay"></div>
            <div class="profile-accent-shape"></div>
          </div>
          
          <div class="profile-info">
            <p class="profile-description">
                你好呀，我是Heron Quinn，一个痴迷于探索AI与设计的边界，享受从0到1的创造快感。2年持续输出技术解决方案，却总像萌新一样拥抱每个黎明，技术是我的游乐场，好奇心是永恒入场券。
            </p>
            
            <div class="profile-actions">
              <a href="#" class="btn btn-primary" @click.prevent="openPasswordDialog('resume')">
                <i class="fas fa-download"></i> 下载简历
              </a>
              <a href="#" class="btn btn-secondary" @click.prevent="openPasswordDialog('projects')">
                <i class="fas fa-briefcase"></i> 项目案例
              </a>
            </div>
            
            <div class="marketing-text">通过以下方式联系我</div>
            
            <div class="social-links">
              <a href="#" class="social-link" data-contact="123456@example.com">
                <i class="fas fa-envelope"></i>
                <span class="contact-tooltip">hyk91888@qq.com</span>
              </a>
              <a href="#" class="social-link" data-contact="123456">
                <i class="fas fa-phone"></i>
                <span class="contact-tooltip">19553306580</span>
              </a>
              <a href="#" class="social-link" data-contact="123456">
                <i class="fab fa-weixin"></i>
                <span class="contact-tooltip">hyk001x</span>
              </a>
              <a href="#" class="social-link" data-contact="123456">
                <i class="fab fa-qq"></i>
                <span class="contact-tooltip">2358238548</span>
              </a>
              <a href="#" class="social-link feishu-link" data-contact="123456">
                <img src="@/assets/icon/feishu.svg" alt="飞书" class="feishu-icon">
                <span class="contact-tooltip">19553306580</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 联系区域 -->
    <div class="contact-section" id="contact">
      <div class="container">
        <div class="section-header">
          <div class="section-tag">快速通道</div>
          <h2 class="section-title">取得联系</h2>
        </div>
        
        <div class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" placeholder="您的姓名" v-model="contactForm.name">
            </div>
            <div class="form-group">
              <label for="email">邮箱</label>
              <input type="email" id="email" placeholder="您的邮箱" v-model="contactForm.email">
            </div>
          </div>
          <div class="form-group">
            <label for="subject">主题</label>
            <input type="text" id="subject" placeholder="消息主题" v-model="contactForm.subject">
          </div>
          <div class="form-group">
            <label for="message">消息</label>
            <textarea id="message" rows="5" placeholder="请输入您的消息" v-model="contactForm.message"></textarea>
          </div>
          <button class="btn send-message-btn" @click.prevent="submitContactForm" :disabled="formSubmitting">
            <i class="fas fa-spinner fa-spin" v-if="formSubmitting"></i>
            <span v-else>发送消息</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 密码对话框 -->
    <div class="password-modal" v-if="showPasswordModal" @click.self="closePasswordDialog">
      <div class="password-modal-content">
        <div class="password-modal-header">
          <h3>暂不对外开放，请输入主人密码</h3>
          <button class="close-btn" @click="closePasswordDialog">&times;</button>
        </div>
        <div class="password-modal-body">
          <input 
            type="password" 
            v-model="password" 
            class="password-input"
            placeholder="请输入密码"
            @keyup.enter="verifyPassword"
          />
          <div class="password-error" v-if="passwordError">{{ passwordError }}</div>
          <button class="password-submit-btn" @click="verifyPassword">确认</button>
        </div>
      </div>
    </div>
    
    <!-- 项目案例对话框 -->
    <div class="project-modal" v-if="isProjectModalVisible" @click.self="closeProjects">
      <div class="project-modal-content">
        <div class="modal-header">
          <h2>我的项目案例</h2>
          <button class="close-btn" @click="closeProjects">&times;</button>
        </div>
        <div class="modal-body">
          <!-- 加载中状态 -->
          <div class="loading-container" v-if="isLoading">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>加载项目案例中...</p>
          </div>
          
          <!-- 错误提示 -->
          <div class="error-container" v-else-if="error">
            <div class="error-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <p>{{ error }}</p>
            <button class="btn btn-secondary retry-btn" @click="fetchProjects">
              <i class="fas fa-sync-alt"></i> 重试
            </button>
          </div>
          
          <!-- 项目列表 -->
          <div class="projects-grid" v-else>
            <div class="project-card" v-for="(project, index) in projects" :key="index">
              <div class="project-image">
                <img :src="project.image" :alt="project.title">
                <div class="project-tags">
                  <span v-for="(tag, tagIndex) in project.tags" :key="tagIndex" class="project-tag">{{ tag }}</span>
                </div>
              </div>
              <div class="project-info">
                <h3 class="project-title">{{ project.title }}</h3>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-footer">
                  <span class="project-date">{{ project.date }}</span>
                  <a :href="project.link" class="project-link" v-if="project.link" target="_blank">查看详情</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加消息提示弹窗 -->
    <div class="message-toast" v-if="formSubmitResult" :class="{'success': formSubmitResult.success, 'error': !formSubmitResult.success}">
      <div class="toast-content">
        <i class="fas" :class="{'fa-check-circle': formSubmitResult.success, 'fa-exclamation-circle': !formSubmitResult.success}"></i>
        <span>{{ formSubmitResult.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AboutView',
  data() {
    return {
      isProjectModalVisible: false,
      projects: [],
      isLoading: false,
      error: null,
      contactForm: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      formSubmitting: false,
      formSubmitResult: null,
      // 密码相关
      showPasswordModal: false,
      password: '',
      passwordError: '',
      passwordAction: null
    }
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    // 密码验证相关
    openPasswordDialog(action) {
      this.showPasswordModal = true;
      this.password = '';
      this.passwordError = '';
      this.passwordAction = action;
      document.body.style.overflow = 'hidden';
    },
    closePasswordDialog() {
      this.showPasswordModal = false;
      document.body.style.overflow = 'auto';
    },
    verifyPassword() {
      if (this.password === 'wdmzhyk6') {
        this.closePasswordDialog();
        // 根据不同的操作执行不同的动作
        if (this.passwordAction === 'resume') {
          this.downloadResume();
        } else if (this.passwordAction === 'projects') {
          this.showProjects();
        }
      } else {
        this.passwordError = '密码错误，请重试';
        this.password = '';
      }
    },
    
    // 项目案例相关
    showProjects() {
      this.isProjectModalVisible = true;
      document.body.style.overflow = 'hidden';
    },
    closeProjects() {
      this.isProjectModalVisible = false;
      document.body.style.overflow = 'auto';
    },
    async fetchProjects() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/api/projects');
        this.projects = response.data.projects;
      } catch (err) {
        console.error('获取项目案例失败:', err);
        this.error = '获取项目数据失败，请稍后再试';
        // 使用假数据作为后备
        this.projects = [
          {
            title: "AI智能客服系统",
            description: "基于GPT的智能客服系统，支持多轮对话，知识库检索，情感分析和业务流程自动化。",
            image: "https://via.placeholder.com/300x200?text=AI客服系统",
            date: "2023年3月",
            tags: ["人工智能", "NLP", "Vue.js"],
            link: "#"
          },
          {
            title: "企业数据分析平台",
            description: "为企业提供实时数据分析和可视化，包含自定义报表、智能预警和多维度数据展示功能。",
            image: "https://via.placeholder.com/300x200?text=数据分析平台",
            date: "2022年11月",
            tags: ["数据分析", "React", "Echarts"],
            link: "#"
          },
          {
            title: "智能家居控制系统",
            description: "面向家庭用户的智能家居控制系统，支持语音控制、远程监控和场景自动化。",
            image: "https://via.placeholder.com/300x200?text=智能家居系统",
            date: "2022年5月",
            tags: ["IoT", "Flutter", "Python"],
            link: "#"
          },
          {
            title: "在线教育平台",
            description: "集课程管理、在线直播、作业批改于一体的教育平台，支持多种教学互动方式。",
            image: "https://via.placeholder.com/300x200?text=在线教育平台",
            date: "2023年1月",
            tags: ["在线教育", "Vue.js", "WebRTC"],
            link: "#"
          }
        ];
      } finally {
        this.isLoading = false;
      }
    },
    
    // 简历下载相关
    downloadResume() {
      // 显示下载中状态
      const downloadButton = document.querySelector('.btn-primary');
      const originalText = downloadButton.innerHTML;
      downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 下载中...';
      
      axios({
        url: '/api/resume/download',
        method: 'GET',
        responseType: 'blob',
      })
        .then(response => {
          // 创建blob链接并触发下载
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Heron_Quinn_简历.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // 恢复按钮状态
          downloadButton.innerHTML = originalText;
        })
        .catch(error => {
          console.error('下载简历失败:', error);
          downloadButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> 下载失败';
          setTimeout(() => {
            downloadButton.innerHTML = originalText;
          }, 2000);
        });
    },
    
    // 联系表单相关
    updateForm(field, value) {
      this.contactForm[field] = value;
    },
    async submitContactForm() {
      // 表单验证
      if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
        this.formSubmitResult = {
          success: false,
          message: '请填写必填字段'
        };
        return;
      }
      
      this.formSubmitting = true;
      this.formSubmitResult = null;
      
      try {
        const response = await axios.post('/api/contact/submit', this.contactForm);
        
        // 提交成功 - 更新提示信息
        this.formSubmitResult = {
          success: true,
          message: '已发送成功，看到会及时回复哦~'
        };
        
        // 清空表单
        this.contactForm = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
      } catch (err) {
        console.error('提交联系表单失败:', err);
        
        // 提交失败
        this.formSubmitResult = {
          success: false,
          message: '发送消息失败，请稍后再试'
        };
      } finally {
        this.formSubmitting = false;
        
        // 4秒后清除结果消息（与CSS动画时间同步）
        setTimeout(() => {
          this.formSubmitResult = null;
        }, 4000);
      }
    }
  }
}
</script>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

html, body {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  overflow-y: scroll;
}

/* 定义通用动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from { 
    opacity: 0; 
    transform: translateY(-30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from { 
    opacity: 0; 
    transform: translateX(-30px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from { 
    opacity: 0; 
    transform: translateX(30px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

/* 将动画应用到各个组件 */
.about-container {
  animation: fadeIn 0.8s ease-out;
  background-image: url('/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  padding-bottom: 20px;
  min-height: 100vh;
}

.about-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 顶部英雄区域 */
.hero-section {
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.6s ease-out;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: float 15s infinite ease-in-out;
}

.particle-1 {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, var(--accent-color) 0%, rgba(60, 190, 100, 0) 70%);
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #9370DB 0%, rgba(147, 112, 219, 0) 70%);
  top: 40%;
  left: 25%;
  animation-delay: 2s;
}

.particle-3 {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, var(--accent-color) 0%, rgba(60, 190, 100, 0) 70%);
  top: 60%;
  right: 20%;
  animation-delay: 4s;
}

.particle-4 {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #9370DB 0%, rgba(147, 112, 219, 0) 70%);
  top: 20%;
  right: 15%;
  animation-delay: 6s;
}

.particle-5 {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, var(--accent-color) 0%, rgba(60, 190, 100, 0) 70%);
  bottom: 20%;
  left: 30%;
  animation-delay: 8s;
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-15px) translateX(15px); }
  50% { transform: translateY(0) translateX(0); }
  75% { transform: translateY(15px) translateX(-15px); }
  100% { transform: translateY(0) translateX(0); }
}

.hero-section::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(60, 190, 100, 0.05) 0%, rgba(60, 190, 100, 0) 70%);
  top: -300px;
  left: -200px;
  border-radius: 50%;
  z-index: 0;
}

.hero-section::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(147, 112, 219, 0.05) 0%, rgba(147, 112, 219, 0) 70%);
  bottom: -200px;
  right: -100px;
  border-radius: 50%;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 2;
  margin-bottom: 50px;
  animation: fadeIn 1s ease-out;
}

.title-container {
  position: relative;
  margin-left: 20px;
  animation: fadeInDown 0.7s ease-out 0.1s both;
}

.title-decoration {
  position: absolute;
  width: 100px;
  height: 100px;
  border-top: 3px solid var(--accent-color);
  border-left: 3px solid var(--accent-color);
  top: -20px;
  left: -20px;
  opacity: 0.3;
  z-index: -1;
  animation: rotateBorder 10s linear infinite;
}

@keyframes rotateBorder {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.main-title {
  font-size: 4.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  position: relative;
  display: flex;
  align-items: center;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: fadeInLeft 0.8s ease-out 0.2s both;
  flex-wrap: wrap;
}

.primary-role {
  background: linear-gradient(to right, #fff, #e0e0e0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
}

.primary-role::after {
  content: 'AI PRODUCT MANAGER';
  position: absolute;
  left: 5px;
  top: 5px;
  font-size: 0.8rem;
  color: var(--accent-color);
  opacity: 0.6;
  letter-spacing: 3px;
  font-weight: normal;
  text-shadow: none;
}

.primary-role::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, var(--accent-color), transparent);
  bottom: -10px;
  left: 0;
  opacity: 0.6;
}

.title-separator {
  color: var(--accent-color);
  margin: 0 20px;
  font-size: 4rem;
  position: relative;
  text-shadow: 0 0 20px rgba(60, 190, 100, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.secondary-role {
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  background-image: linear-gradient(to right, var(--accent-color), #9370DB);
  font-weight: 700;
  position: relative;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

.secondary-role::before {
  content: '</>'; 
  position: absolute;
  top: -15px;
  left: 0;
  background-color: #121212;
  padding: 0 8px;
  color: var(--accent-color);
  font-size: 1rem;
  font-weight: normal;
  animation: fadeInDown 1s ease-out 0.8s both;
  z-index: 1;
}

.amateur-roles {
  margin-top: 30px;
  animation: fadeInUp 0.7s ease-out 0.3s both;
  position: relative;
}

.amateur-roles-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-left: 20px;
}

.minor-role {
  display: flex;
  align-items: center;
  background: rgba(30, 30, 30, 0.6);
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 1.1rem;
  color: #ddd;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.minor-role:hover {
  transform: translateY(-3px);
  background: rgba(60, 190, 100, 0.2);
  border-color: var(--accent-color);
}

.role-icon {
  margin-right: 8px;
  color: var(--accent-color);
}

.design-role:hover .role-icon {
  color: #ff6b6b;
}

.photo-role:hover .role-icon {
  color: #4dabf7;
}

.video-role:hover .role-icon {
  color: #ffd43b;
}

.effect-role:hover .role-icon {
  color: #ae3ec9;
}

.rpa-role:hover .role-icon {
  color: #ff9900;
}

/* 个人资料区域 */
.profile-area {
  display: flex;
  gap: 60px;
  align-items: center;
  margin-top: 30px;
}

.profile-image-container {
  position: relative;
  width: 550px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 0.3s forwards;
}

.profile-circle {
  position: absolute;
  width: 380px;
  height: 380px;
  background: linear-gradient(135deg, #9370DB, var(--accent-color));
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  animation: fadeIn 0.7s ease-out 0.4s forwards;
  box-shadow: 0 10px 30px rgba(147, 112, 219, 0.4);
  transform: translate(0, 0);
  top: 80px;
}

.profile-image {
  width: 480px;
  height: 540px;
  overflow: hidden;   
  position: absolute;
  z-index: 2; 
  border-radius: 0;
  top: -80px;
  left: 34px;
  clip-path: ellipse(50% 60% at 50% 40%); 
  opacity: 0;
  animation: fadeIn 0.7s ease-out 0.5s forwards;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;  
  object-position: center 20%;
  transform: scale(1.1);
}

.profile-overlay {
  position: absolute;
  width: 560px;
  height: 140px;
  background-color: rgba(147, 112, 219, 0.6);
  transform: translateY(100px) rotate(-10deg);
  z-index: 3;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 0.6s forwards;
}

.profile-accent-shape {
  position: absolute;
  width: 560px;
  height: 140px;
  background-color: rgba(255, 180, 255, 0.4);
  transform: translateY(-40px) rotate(15deg);
  z-index: 0;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 0.6s forwards;
}

.profile-shape {
  display: none; /* 移除旧的背景形状 */
}

.profile-info {
  flex: 1;
  opacity: 0;
  animation: fadeInRight 0.8s ease-out 0.4s forwards;
}

.profile-description {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 30px;
  text-align: justify;
  opacity: 0;
  animation: fadeInUp 0.7s ease-out 0.5s forwards;
}

.profile-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeInUp 0.7s ease-out 0.6s forwards;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 25px;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  gap: 10px;
}

.btn-primary {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(147, 112, 219, 0.3);
}

.btn-secondary {
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
}

.btn-secondary:hover {
  background-color: #444;
  transform: translateY(-3px);
}

.marketing-text {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  opacity: 0;
  animation: fadeInUp 0.7s ease-out 0.7s forwards;
}

.marketing-text::before {
  content: '';
  width: 50px;
  height: 2px;
  background-color: var(--accent-color);
}

.social-links {
  display: flex;
  gap: 15px;
  opacity: 0;
  animation: fadeInUp 0.7s ease-out 0.8s forwards;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.social-link:hover {
  background-color: var(--accent-color);
  transform: translateY(-3px);
}

.social-link:nth-child(1):hover {
  background-color: #ea4335;
}

.social-link:nth-child(2):hover {
  background-color: #4285f4;
}

.social-link:nth-child(3):hover {
  background-color: #07c160;
}

.social-link:nth-child(4):hover {
  background-color: #12b7f5;
}

.social-link:nth-child(5):hover {
  background-color: #3370ff;
}

.feishu-icon {
  width: 20px;
  height: 20px;
  filter: none;
}

.feishu-link:hover .feishu-icon {
  filter: none;
}

.contact-tooltip {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #222;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}

.contact-tooltip::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 5px 5px 5px;
  border-style: solid;
  border-color: transparent transparent #222 transparent;
}

.social-link:hover .contact-tooltip {
  opacity: 1;
  visibility: visible;
  bottom: -45px;
}

/* 联系区域 */
.section-header {
  text-align: center;
  margin-bottom: 50px;
  padding-top: 50px;
  opacity: 0;
  animation: fadeInUp 0.7s ease-out 1.0s forwards;
}

.section-tag {
  color: var(--accent-color);
  font-size: 1rem;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

.section-tag::before,
.section-tag::after {
  content: '';
  width: 30px;
  height: 1px;
  background-color: var(--accent-color);
  position: absolute;
  top: 50%;
}

.section-tag::before {
  left: -40px;
}

.section-tag::after {
  right: -40px;
}

.section-title {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 10px;
}

.contact-form {
  max-width: 800px;
  margin: 0 auto;
  background-color: rgba(34, 34, 34, 0.7);
  padding: 40px;
  border-radius: 10px;
  opacity: 0;
  animation: fadeInUp 0.7s ease-out 1.1s forwards;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.form-row:nth-of-type(1) {
  animation-delay: 1.2s;
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.form-group:nth-of-type(3) {
  animation-delay: 1.3s;
}

.form-group:nth-of-type(4) {
  animation-delay: 1.4s;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #fff;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--accent-color);
  outline: none;
}

.send-message-btn {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out 1.5s forwards;
}

.send-message-btn:hover {
  background-color: var(--accent-hover, #8b44da);
  transform: translateY(-3px);
}

/* 删除原来的表单提交结果样式 */
.form-result {
  display: none;
}

/* 添加新的消息提示弹窗样式 */
.message-toast {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 18px;
  border-radius: 6px;
  z-index: 10000;
  animation: toastFadeIn 0.3s ease, toastFloatUp 0.5s ease, toastFadeOut 0.3s ease 4s forwards;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  max-width: 85%;
  width: auto;
  backdrop-filter: blur(4px);
}

.message-toast.success {
  background-color: rgba(20, 20, 30, 0.9);
  color: #fff;
  border-left: 3px solid #9370DB;
}

.message-toast.error {
  background-color: rgba(20, 20, 30, 0.9);
  color: #fff;
  border-left: 3px solid #ff4c4c;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast-content i {
  font-size: 1.2rem;
}

.toast-content i.fa-check-circle {
  color: #9370DB;
}

.toast-content i.fa-exclamation-circle {
  color: #ff4c4c;
}

.toast-content span {
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.3px;
}

@keyframes toastFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes toastFloatUp {
  from { transform: translate(-50%, 20px); }
  to { transform: translate(-50%, 0); }
}

@keyframes toastFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* 禁用状态的按钮样式 */
.send-message-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 响应式修改 */
:root {
  --accent-color: #3cbe64;
  --accent-hover: #35a558;
}

/* 项目案例对话框样式 */
.project-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;
  padding: 30px 0;
  backdrop-filter: blur(5px);
}

.project-modal-content {
  background-color: #1a1a1a;
  width: 85%;
  max-width: 1200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.7);
  animation: fadeInUp 0.4s ease;
  position: relative;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
}

.modal-header {
  padding: 20px 30px;
  background-color: #111;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.modal-header h2 {
  color: #fff;
  margin: 0;
  font-size: 1.8rem;
  position: relative;
  padding-left: 15px;
}

.modal-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background-color: var(--accent-color);
  border-radius: 2px;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
  background-color: #1a1a1a;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.project-card {
  background-color: #222;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #333;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  border-color: #444;
}

.project-image {
  position: relative;
  overflow: hidden;
  height: 180px;
}

.project-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 30%);
  z-index: 1;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-tags {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  z-index: 2;
}

.project-tag {
  background-color: var(--accent-color);
  color: #fff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.project-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-title {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  position: relative;
  padding-bottom: 10px;
}

.project-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background-color: var(--accent-color);
  border-radius: 1.5px;
}

.project-description {
  color: #aaa;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
  flex: 1;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #333;
}

.project-date {
  color: #777;
  font-size: 0.85rem;
}

.project-link {
  color: var(--accent-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.project-link::after {
  content: '→';
  transition: transform 0.3s ease;
}

.project-link:hover {
  color: #fff;
}

.project-link:hover::after {
  transform: translateX(3px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
  
  .project-modal-content {
    width: 95%;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
  }
  
  .modal-body {
    padding: 20px;
  }
}

@media (max-width: 576px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .project-image {
    height: 160px;
  }
}

/* 加载状态和错误提示样式 */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  font-size: 3rem;
  color: var(--accent-color);
  margin-bottom: 20px;
  animation: spin 1.5s infinite linear;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  color: #ff6b6b;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.error-container p {
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: #ddd;
}

.retry-btn {
  padding: 8px 20px;
  background-color: #333;
  border: 1px solid #444;
}

.retry-btn:hover {
  background-color: #444;
}

/* 响应式修改 */
@media (max-width: 1100px) {
  .title-container {
    margin-left: 0;
  }
  
  .main-title {
    justify-content: center;
    font-size: 4rem;
  }
  
  .amateur-roles-wrapper {
    justify-content: center;
    margin-left: 0;
  }
  
  .profile-area {
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .profile-image-container {
    margin-right: 0;
    margin-bottom: 40px;
  }
  
  .marketing-text {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 80px 0 40px;
  }
  
  .title-container {
    margin-left: 0;
    text-align: center;
  }
  
  .main-title {
    font-size: 3rem;
    flex-direction: column;
    gap: 10px;
  }
  
  .title-separator {
    margin: 10px 0;
    font-size: 2.5rem;
  }
  
  .title-decoration {
    width: 70px;
    height: 70px;
    top: -15px;
    left: -15px;
  }
  
  .primary-role::before {
    bottom: -5px;
    height: 3px;
  }
  
  .primary-role::after {
    font-size: 0.7rem;
    letter-spacing: 2px;
  }
  
  .secondary-role {
    font-size: 2.5rem;
  }
  
  .secondary-role::before {
    font-size: 0.9rem;
    top: -12px;
  }
  
  .amateur-roles-wrapper {
    justify-content: center;
  }
  
  .profile-image-container {
    width: 400px;
    height: 360px;
  }
  
  .profile-circle {
    width: 300px;
    height: 300px;
    top: 50px;
  }
  
  .profile-image {
    width: 300px;
    height: 340px;
    top: 0;
  }
  
  .profile-overlay {
    width: 360px;
    height: 100px;
    transform: translateY(60px) rotate(-10deg);
  }
  
  .profile-accent-shape {
    width: 360px;
    height: 100px;
    transform: translateY(-20px) rotate(15deg);
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 60px 0 30px;
  }
  
  .title-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .main-title {
    font-size: 2.5rem;
    text-align: center;
    flex-direction: column;
  }
  
  .hero-particles .particle {
    opacity: 0.2;
  }
  
  .title-decoration {
    display: none;
  }
  
  .secondary-role {
    font-size: 2rem;
    margin-top: 5px;
  }
  
  .amateur-roles-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .minor-role {
    font-size: 1rem;
    padding: 6px 12px;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .profile-image-container {
    width: 320px;
    height: 280px;
  }
  
  .profile-circle {
    width: 240px;
    height: 240px;
    top: 40px;
  }
  
  .profile-image {
    width: 240px;
    height: 280px;
    top: 0;
  }
  
  .profile-overlay {
    width: 280px;
    height: 80px;
    transform: translateY(50px) rotate(-10deg);
  }
  
  .profile-accent-shape {
    width: 280px;
    height: 80px;
    transform: translateY(-15px) rotate(15deg);
  }
}

/* 密码对话框样式 */
.password-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.password-modal-content {
  background-color: #121212;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(147, 112, 219, 0.2);
  border: 1px solid #333;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.password-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #333;
  background-color: #1a1a1a;
}

.password-modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
  font-weight: 500;
}

.password-modal-body {
  padding: 25px;
}

.password-input {
  width: 100%;
  padding: 12px 15px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.password-input:focus {
  outline: none;
  border-color: #9370DB;
  box-shadow: 0 0 0 2px rgba(147, 112, 219, 0.2);
}

.password-error {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-bottom: 15px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.password-submit-btn {
  width: 100%;
  padding: 12px 0;
  background-color: #9370DB;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.password-submit-btn:hover {
  background-color: #8a61d4;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(147, 112, 219, 0.3);
}
</style> 