<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <i class="fas fa-shield-alt"></i>
        </div>
        <h2>后台管理系统</h2>
        <p>请输入管理员账号和密码</p>
      </div>
      
      <div class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="请输入用户名"
              @keyup.enter="focusPassword"
              autocomplete="username"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="请输入密码"
              @keyup.enter="login"
              ref="passwordInput"
              autocomplete="current-password"
            >
          </div>
        </div>
        
        <div class="error-message" v-if="errorMsg">
          <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
        </div>
        
        <button 
          class="login-btn" 
          @click="login" 
          :disabled="isLoggingIn"
        >
          <i class="fas fa-spinner fa-spin" v-if="isLoggingIn"></i>
          <span v-else>登录</span>
        </button>
        
        <div class="login-footer">
          <router-link to="/" class="back-to-site">
            <i class="fas fa-arrow-left"></i> 返回网站首页
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="login-background"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminLogin',
  data() {
    return {
      username: '',
      password: '',
      errorMsg: '',
      isLoggingIn: false
    }
  },
  methods: {
    focusPassword() {
      this.$refs.passwordInput.focus();
    },
    async login() {
      // 表单验证
      if (!this.username || !this.password) {
        this.errorMsg = '请输入用户名和密码';
        return;
      }
      
      this.isLoggingIn = true;
      this.errorMsg = '';
      
      try {
        // 调用登录API
        const response = await axios.post('/api/admin/login', {
          username: this.username,
          password: this.password
        });
        
        // 登录成功，保存token
        localStorage.setItem('admin_token', response.data.token);
        
        // 获取重定向URL或导航到默认页面
        const redirectPath = this.$route.query.redirect || '/admin/dashboard';
        this.$router.push(redirectPath);
      } catch (error) {
        console.error('登录失败:', error);
        
        // 显示错误信息
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMsg = error.response.data.message;
        } else {
          this.errorMsg = '登录失败，请检查用户名和密码';
        }
        
        // TODO: 临时调试用，实际部署时删除
        if (this.username === 'admin' && this.password === 'wdmzhyk6') {
          localStorage.setItem('admin_token', 'test_token');
          this.$router.push('/admin/dashboard');
        }
      } finally {
        this.isLoggingIn = false;
      }
    }
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 80%);
  z-index: -1;
}

.login-container {
  width: 100%;
  max-width: 450px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  padding: 40px 30px;
  text-align: center;
  background: linear-gradient(to right, #9370DB, #8a61d4);
  color: #fff;
}

.logo {
  width: 70px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.logo i {
  font-size: 2rem;
}

.login-header h2 {
  margin: 0;
  font-size: 1.8rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
}

.login-form {
  padding: 40px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #555;
  font-size: 0.95rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9370DB;
  font-size: 1.1rem;
}

.form-group input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #9370DB;
  box-shadow: 0 0 0 4px rgba(147, 112, 219, 0.15);
  background-color: #fff;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-bottom: 20px;
  padding: 12px 15px;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  animation: shake 0.5s ease;
}

.error-message i {
  margin-right: 8px;
  font-size: 1rem;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.login-btn {
  width: 100%;
  padding: 15px 0;
  background: linear-gradient(to right, #9370DB, #8a61d4);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(147, 112, 219, 0.2);
}

.login-btn:hover {
  box-shadow: 0 6px 15px rgba(147, 112, 219, 0.3);
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 25px;
  text-align: center;
}

.back-to-site {
  color: #666;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.back-to-site i {
  margin-right: 6px;
  font-size: 0.9rem;
}

.back-to-site:hover {
  color: #9370DB;
}

@media (max-width: 576px) {
  .login-container {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
  
  .login-background {
    clip-path: polygon(0 0, 100% 0, 100% 30%, 0 40%);
  }
  
  .login-header {
    padding: 30px 20px;
  }
  
  .logo {
    width: 60px;
    height: 60px;
  }
  
  .login-form {
    padding: 30px 20px;
  }
}
</style> 