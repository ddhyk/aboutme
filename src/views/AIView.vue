<template>
    <div class="ai-container">
      <div class="ai-header">
        <div class="container">
          <h1 class="ai-title">AI 助手</h1>
          <p class="ai-subtitle">通过人工智能辅助您的学习和开发</p>
        </div>
      </div>
      
      <div class="container main-content-area">
        <div class="ai-chat-container">
          <div class="chat-sidebar">
            <div class="chat-header">
              <h3>会话历史</h3>
              <button class="new-chat-btn" @click="startNewChat">
                <i class="fas fa-plus"></i> 新会话
              </button>
            </div>
            
            <div class="chat-history">
              <div 
                v-for="(chat, index) in chatHistory" 
                :key="index"
                @click="selectChat(index)"
                :class="['chat-item', selectedChatIndex === index ? 'active' : '']"
              >
                <div class="chat-icon">
                  <i class="fas fa-comment-alt"></i>
                </div>
                <div class="chat-info">
                  <div class="chat-title">{{ chat.title }}</div>
                  <div class="chat-date">{{ chat.date }}</div>
                </div>
                <button class="delete-chat-btn" @click.stop="deleteChat(index)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
              
              <div v-if="chatHistory.length === 0" class="no-history">
                <i class="fas fa-comments"></i>
                <p>没有聊天记录</p>
              </div>
            </div>
          </div>
          
          <div class="chat-main">
            <div class="chat-messages" ref="messagesContainer">
              <div v-if="selectedChat.messages.length === 0" class="welcome-message">
                <div class="welcome-header">
                  <img src="/images/logo-1.png" alt="AI Logo" class="ai-logo">
                  <h2>AI学习助手</h2>
                </div>
                <p>您好！我是您的AI学习助手，可以帮助您：</p>
                <div class="suggestion-grid">
                  <div 
                    v-for="(suggestion, index) in suggestions" 
                    :key="index"
                    class="suggestion-item"
                    @click="usePromptSuggestion(suggestion)"
                  >
                    <i :class="['fas', suggestion.icon]"></i>
                    <div class="suggestion-text">{{ suggestion.text }}</div>
                  </div>
                </div>
              </div>
              
              <div 
                v-for="(message, index) in selectedChat.messages" 
                :key="index"
                :class="['message', message.sender === 'user' ? 'user-message' : 'ai-message']"
              >
                <div class="message-avatar">
                  <i :class="['fas', message.sender === 'user' ? 'fa-user' : 'fa-robot']"></i>
                </div>
                <div class="message-content">
                  <div class="message-text" v-html="formatMessage(message.text)"></div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
              </div>
              
              <div v-if="isTyping" class="message ai-message typing">
                <div class="message-avatar">
                  <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                  <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-input-container">
              <textarea 
                v-model="userInput" 
                @keydown.enter.prevent="sendMessage"
                placeholder="输入您的问题..."
                class="chat-input"
                ref="chatInput"
              ></textarea>
              <button 
                class="send-btn" 
                @click="sendMessage"
                :disabled="userInput.trim() === ''"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AIView',
    data() {
      return {
        userInput: '',
        isTyping: false,
        selectedChatIndex: 0,
        chatHistory: [
          {
            title: '新的会话',
            date: this.formatDate(new Date()),
            messages: []
          }
        ],
        suggestions: [
          { text: '解释JavaScript中的闭包概念', icon: 'fa-code' },
          { text: '如何使用Vue组合式API创建自定义Hook？', icon: 'fa-vuejs' },
          { text: '帮我理解CSS Grid和Flexbox的区别', icon: 'fa-css3-alt' },
          { text: '解释RESTful API设计原则', icon: 'fa-server' },
          { text: '介绍一下常见的算法复杂度', icon: 'fa-sitemap' },
          { text: '如何优化网站加载速度？', icon: 'fa-tachometer-alt' }
        ]
      }
    },
    computed: {
      selectedChat() {
        return this.chatHistory[this.selectedChatIndex] || { title: '', date: '', messages: [] };
      }
    },
    mounted() {
      // 加载本地存储的聊天记录
      const savedChatHistory = localStorage.getItem('aiChatHistory');
      if (savedChatHistory) {
        this.chatHistory = JSON.parse(savedChatHistory);
      }
      
      // 聊天输入框自动获取焦点
      this.$nextTick(() => {
        if (this.$refs.chatInput) {
          this.$refs.chatInput.focus();
        }
      });
    },
    watch: {
      // 监听聊天记录变化，保存到本地存储
      chatHistory: {
        handler(newValue) {
          localStorage.setItem('aiChatHistory', JSON.stringify(newValue));
        },
        deep: true
      }
    },
    methods: {
      sendMessage() {
        if (this.userInput.trim() === '') return;
        
        // 添加用户消息
        this.selectedChat.messages.push({
          text: this.userInput,
          sender: 'user',
          time: this.formatTime(new Date())
        });
        
        // 如果是第一条消息，更新会话标题
        if (this.selectedChat.messages.length === 1) {
          this.selectedChat.title = this.userInput.slice(0, 30) + (this.userInput.length > 30 ? '...' : '');
        }
        
        const userMessage = this.userInput;
        this.userInput = '';
        
        // 滚动到最新消息
        this.scrollToBottom();
        
        // 模拟AI思考
        this.isTyping = true;
        setTimeout(() => {
          this.receiveAIResponse(userMessage);
        }, 1000 + Math.random() * 2000); // 随机1-3秒的延迟
      },
      
      receiveAIResponse(userMessage) {
        // 这里是模拟的AI响应，实际应用中应该调用真实的AI API
        const responses = {
          '解释JavaScript中的闭包概念': '闭包是指有权访问另一个函数作用域中的变量的函数。在JavaScript中，闭包通常用于创建私有变量和方法，以及维护函数执行环境的状态。\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\n在这个例子中，`createCounter`函数返回的匿名函数形成了一个闭包，它可以访问`createCounter`函数作用域中的`count`变量。',
          
          '如何使用Vue组合式API创建自定义Hook？': 'Vue 3的组合式API允许我们创建可复用的逻辑单元，称为"组合函数"或"Hook"。以下是创建自定义Hook的步骤：\n\n```javascript\n// useCounter.js\nimport { ref, computed } from \'vue\';\n\nexport function useCounter(initialValue = 0) {\n  const count = ref(initialValue);\n  const doubled = computed(() => count.value * 2);\n  \n  function increment() {\n    count.value++;\n  }\n  \n  function decrement() {\n    count.value--;\n  }\n  \n  return {\n    count,\n    doubled,\n    increment,\n    decrement\n  };\n}\n```\n\n使用这个Hook：\n\n```javascript\n// 在组件中\nimport { useCounter } from \'./useCounter\';\n\nexport default {\n  setup() {\n    const { count, doubled, increment, decrement } = useCounter(10);\n    \n    return {\n      count,\n      doubled,\n      increment,\n      decrement\n    };\n  }\n};\n```',
          
          '帮我理解CSS Grid和Flexbox的区别': 'CSS Grid和Flexbox都是强大的布局工具，但它们有不同的设计目标和使用场景：\n\n**Flexbox（弹性盒子）**：\n- 一维布局系统，主要处理行或列的排列\n- 适合组件内部元素的布局\n- 更容易对齐元素和分配空间\n- 对不确定大小的内容非常有效\n\n```css\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\n**Grid（网格）**：\n- 二维布局系统，同时处理行和列\n- 适合整体页面布局\n- 可以精确控制元素在二维空间中的位置\n- 适合复杂的布局结构\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n}\n```\n\n**最佳实践**：结合使用两者，Grid用于整体页面布局，Flexbox用于组件内部布局。'
        };
        
        // 默认响应
        let response = '我是一个模拟的AI助手，无法提供真实的回答。在实际应用中，这里应该连接到真正的AI模型API。';
        
        // 检查是否有匹配的预设回答
        for (const key in responses) {
          if (userMessage.includes(key)) {
            response = responses[key];
            break;
          }
        }
        
        // 添加AI回复
        this.isTyping = false;
        this.selectedChat.messages.push({
          text: response,
          sender: 'ai',
          time: this.formatTime(new Date())
        });
        
        // 滚动到最新消息
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      
      startNewChat() {
        this.chatHistory.unshift({
          title: '新的会话',
          date: this.formatDate(new Date()),
          messages: []
        });
        this.selectedChatIndex = 0;
        
        // 聊天输入框自动获取焦点
        this.$nextTick(() => {
          if (this.$refs.chatInput) {
            this.$refs.chatInput.focus();
          }
        });
      },
      
      selectChat(index) {
        this.selectedChatIndex = index;
        
        // 滚动到最新消息
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      
      deleteChat(index) {
        if (confirm('确定要删除这个会话吗？')) {
          this.chatHistory.splice(index, 1);
          
          // 如果删除了当前选中的会话，则选择第一个会话
          if (this.chatHistory.length === 0) {
            this.startNewChat();
          } else if (index <= this.selectedChatIndex) {
            this.selectedChatIndex = Math.max(0, this.selectedChatIndex - 1);
          }
        }
      },
      
      formatDate(date) {
        return new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(date);
      },
      
      formatTime(date) {
        return new Intl.DateTimeFormat('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      },
      
      formatMessage(text) {
        // 简单的Markdown样式解析：代码块
        return text.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');
      },
      
      usePromptSuggestion(suggestion) {
        this.userInput = suggestion.text;
        this.sendMessage();
      },
      
      scrollToBottom() {
        if (this.$refs.messagesContainer) {
          this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .ai-container {
    padding-top: 30px;
  }
  
  .ai-header {
    background-color: var(--bg-secondary);
    padding: 60px 0;
    margin-bottom: 40px;
    text-align: center;
    border-radius: 10px;
  }
  
  .ai-title {
    font-size: 2.5rem;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #9370DB, #ff00ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }
  
  .ai-subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto;
  }
  
  .main-content-area {
    padding: 20px 0 100px;
  }
  
  .ai-chat-container {
    display: flex;
    gap: 30px;
    height: 70vh;
    min-height: 500px;
    margin-bottom: 40px;
  }
  
  .chat-sidebar {
    width: 300px;
    background-color: var(--bg-secondary);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .chat-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .chat-header h3 {
    margin: 0;
    color: var(--text-primary);
  }
  
  .new-chat-btn {
    background-color: var(--accent-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s;
  }
  
  .new-chat-btn:hover {
    background-color: var(--accent-hover);
  }
  
  .chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }
  
  .chat-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .chat-item:hover {
    background-color: var(--bg-tertiary);
  }
  
  .chat-item.active {
    background-color: rgba(147, 112, 219, 0.2);
  }
  
  .chat-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--bg-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    color: var(--accent-color);
  }
  
  .chat-info {
    flex: 1;
    overflow: hidden;
  }
  
  .chat-title {
    color: var(--text-primary);
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }
  
  .chat-date {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }
  
  .delete-chat-btn {
    opacity: 0;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: opacity 0.3s, color 0.3s;
  }
  
  .chat-item:hover .delete-chat-btn {
    opacity: 1;
  }
  
  .delete-chat-btn:hover {
    color: #F44336;
  }
  
  .no-history {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
  }
  
  .no-history i {
    font-size: 3rem;
    margin-bottom: 10px;
  }
  
  .chat-main {
    flex: 1;
    background-color: var(--bg-secondary);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .welcome-message {
    text-align: center;
    padding: 40px 20px;
  }
  
  .welcome-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .ai-logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 15px;
  }
  
  .welcome-message h2 {
    color: var(--text-primary);
    margin-bottom: 20px;
  }
  
  .welcome-message p {
    color: var(--text-secondary);
    margin-bottom: 30px;
  }
  
  .suggestion-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .suggestion-item {
    background-color: var(--bg-tertiary);
    padding: 15px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .suggestion-item:hover {
    background-color: rgba(147, 112, 219, 0.2);
    transform: translateY(-3px);
  }
  
  .suggestion-item i {
    color: var(--accent-color);
    font-size: 1.2rem;
    margin-right: 10px;
  }
  
  .suggestion-text {
    color: var(--text-primary);
    font-size: 0.9rem;
  }
  
  .message {
    display: flex;
    margin-bottom: 20px;
  }
  
  .user-message {
    justify-content: flex-end;
  }
  
  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--bg-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
  }
  
  .user-message .message-avatar {
    order: 2;
    margin-right: 0;
    margin-left: 15px;
    background-color: var(--accent-color);
    color: white;
  }
  
  .ai-message .message-avatar {
    color: var(--accent-color);
  }
  
  .message-content {
    max-width: 70%;
    padding: 15px;
    border-radius: 10px;
    background-color: var(--bg-tertiary);
    position: relative;
  }
  
  .user-message .message-content {
    background-color: var(--accent-color);
    color: white;
  }
  
  .message-text {
    word-break: break-word;
    line-height: 1.5;
  }
  
  .message-time {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 5px;
    text-align: right;
  }
  
  .user-message .message-time {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .typing-indicator {
    display: flex;
    align-items: center;
  }
  
  .typing-indicator span {
    width: 8px;
    height: 8px;
    margin: 0 2px;
    background-color: var(--text-secondary);
    border-radius: 50%;
    display: inline-block;
    animation: typing 1.4s infinite ease-in-out both;
  }
  
  .typing-indicator span:nth-child(1) {
    animation-delay: 0s;
  }
  
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.6;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .chat-input-container {
    padding: 15px;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 10px;
  }
  
  .chat-input {
    flex: 1;
    padding: 12px 15px;
    border: none;
    border-radius: 8px;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 1rem;
    resize: none;
    min-height: 50px;
    max-height: 100px;
    outline: none;
  }
  
  .send-btn {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: var(--accent-color);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .send-btn:hover:not(:disabled) {
    background-color: var(--accent-hover);
  }
  
  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .code-block {
    background-color: var(--bg-tertiary);
    padding: 15px;
    border-radius: 6px;
    margin: 10px 0;
    overflow-x: auto;
    font-family: monospace;
    line-height: 1.4;
    color: var(--text-primary);
    white-space: pre;
  }
  
  .ai-message .code-block {
    background-color: rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 991px) {
    .ai-chat-container {
      flex-direction: column;
      height: auto;
    }
    
    .chat-sidebar {
      width: 100%;
      height: 300px;
    }
    
    .chat-main {
      height: 500px;
    }
    
    .suggestion-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .ai-title {
      font-size: 2rem;
    }
    
    .ai-subtitle {
      font-size: 1rem;
    }
    
    .message-content {
      max-width: 80%;
    }
  }
  </style>