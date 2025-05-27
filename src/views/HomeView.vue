<template>
    <div class="home-container">
        <div class="container">
            <div class="logo">
                <img src="/images/logo-1.png" alt="Heron Quinn Logo" width="120" height="120">
            </div>
            <h1 class="pixel-font fade-in-delay-1">Heron Quinn</h1>
            <p class="subtitle fade-in-delay-2">Steady steps to triumph</p>
            
            <div class="quote fade-in-delay-3">
                <p>今日事今日毕，勿將今事待明日</p>
                <p class="author">-「谚语」</p>
            </div>
            
            <div class="nav-buttons fade-in-delay-4">
                <router-link to="/about" class="btn">关于我</router-link>
                <a href="#" class="btn" @click.prevent="openPasswordDialog('blog')">智技仓</a>
                <a href="#" class="btn" @click.prevent="openPasswordDialog('resource')">资源中心</a>
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
    </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      showPasswordModal: false,
      password: '',
      passwordError: '',
      targetRoute: null
    }
  },
  methods: {
    openPasswordDialog(route) {
      this.showPasswordModal = true;
      this.password = '';
      this.passwordError = '';
      this.targetRoute = route;
      document.body.style.overflow = 'hidden';
    },
    closePasswordDialog() {
      this.showPasswordModal = false;
      document.body.style.overflow = '';
    },
    verifyPassword() {
      if (this.password === 'wdmzhyk6') {
        this.closePasswordDialog();
        this.$router.push('/' + this.targetRoute);
      } else {
        this.passwordError = '密码错误，请重试';
        this.password = '';
      }
    }
  }
}
</script>

<style>
.home-container {
    /* 填充整个视图区域 */
    min-height: 100vh;
    width: 100%;
    /* 设置背景图 */
    background-image: url('/images/background.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    font-family: 'Arial', sans-serif;
    color: #ffffff;
}

/* 添加暗色蒙版 */
.home-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.65); /* 调整透明度控制暗度 */
    z-index: 1;
}

.container {
    text-align: center;
    z-index: 3;  /* 提高内容的z-index，确保在动态背景之上 */
    padding: 20px;
    max-width: 800px;
    position: relative;
}

/* 渐入动画 */
.fade-in-delay-1 {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInAnimation 1s ease forwards 0.3s;
}

.fade-in-delay-2 {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInAnimation 1s ease forwards 0.6s;
}

.fade-in-delay-3 {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInAnimation 1s ease forwards 0.9s;
}

.fade-in-delay-4 {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInAnimation 1s ease forwards 1.2s;
}

@keyframes fadeInAnimation {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Logo样式 */
.logo {
    margin-bottom: 20px;
}

.logo img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    animation: float 3s ease-in-out infinite;
}

/* 标题样式 */
.pixel-font {
    font-family: 'Press Start 2P', cursive;
    font-size: 3rem;
    margin-bottom: 10px;
    color: #ffffff;
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.subtitle {
    font-size: 1.2rem;
    margin-bottom: 40px;
    color: #cccccc;
    letter-spacing: 1px;
}

/* 引用样式 */
.quote {
    margin: 40px 0;
    font-style: italic;
    line-height: 1.6;
}

.quote p {
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.author {
    font-size: 1rem;
    color: #aaaaaa;
}

/* 导航按钮样式 */
.nav-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 40px;
}

.btn {
    display: inline-block;
    padding: 12px 30px;
    background-color: transparent;
    border: 2px solid #ffffff;
    border-radius: 30px;
    color: #ffffff;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.btn:hover {
    background-color: #ffffff;
    color: #121212;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
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

.password-modal-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #fff;
}

.close-btn {
    background: none;
    border: none;
    color: #aaa;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.close-btn:hover {
    color: #fff;
    transform: rotate(90deg);
}

.password-modal-body {
    padding: 25px;
}

.password-modal-body p {
    margin-top: 0;
    margin-bottom: 20px;
    color: #ddd;
    font-size: 1rem;
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

/* 动画效果 */
@keyframes float {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .pixel-font {
        font-size: 2.5rem;
    }
    
    .nav-buttons {
        gap: 15px;
    }
    
    .btn {
        padding: 10px 25px;
    }
    
    .password-modal-content {
        width: 95%;
    }
}

@media (max-width: 480px) {
    .pixel-font {
        font-size: 2rem;
    }
    
    .logo img {
        width: 100px;
        height: 100px;
    }
    
    .btn {
        padding: 8px 20px;
        font-size: 0.9rem;
    }
    
    .password-modal-header h2 {
        font-size: 1.1rem;
    }
    
    .password-modal-body {
        padding: 20px;
    }
} 
</style> 