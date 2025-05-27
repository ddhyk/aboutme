import{_ as C,o,c,a as e,e as I,F as _,d as p,h as f,g as x,v as y,k,n as d,t as h,l as v,p as b,f as T,m as w}from"./index-3cf4fa74.js";const S={name:"AIView",data(){return{userInput:"",isTyping:!1,selectedChatIndex:0,chatHistory:[{title:"新的会话",date:this.formatDate(new Date),messages:[]}],suggestions:[{text:"解释JavaScript中的闭包概念",icon:"fa-code"},{text:"如何使用Vue组合式API创建自定义Hook？",icon:"fa-vuejs"},{text:"帮我理解CSS Grid和Flexbox的区别",icon:"fa-css3-alt"},{text:"解释RESTful API设计原则",icon:"fa-server"},{text:"介绍一下常见的算法复杂度",icon:"fa-sitemap"},{text:"如何优化网站加载速度？",icon:"fa-tachometer-alt"}]}},computed:{selectedChat(){return this.chatHistory[this.selectedChatIndex]||{title:"",date:"",messages:[]}}},mounted(){const t=localStorage.getItem("aiChatHistory");t&&(this.chatHistory=JSON.parse(t)),this.$nextTick(()=>{this.$refs.chatInput&&this.$refs.chatInput.focus()})},watch:{chatHistory:{handler(t){localStorage.setItem("aiChatHistory",JSON.stringify(t))},deep:!0}},methods:{sendMessage(){if(this.userInput.trim()==="")return;this.selectedChat.messages.push({text:this.userInput,sender:"user",time:this.formatTime(new Date)}),this.selectedChat.messages.length===1&&(this.selectedChat.title=this.userInput.slice(0,30)+(this.userInput.length>30?"...":""));const t=this.userInput;this.userInput="",this.scrollToBottom(),this.isTyping=!0,setTimeout(()=>{this.receiveAIResponse(t)},1e3+Math.random()*2e3)},receiveAIResponse(t){const i={解释JavaScript中的闭包概念:`闭包是指有权访问另一个函数作用域中的变量的函数。在JavaScript中，闭包通常用于创建私有变量和方法，以及维护函数执行环境的状态。

\`\`\`javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

在这个例子中，\`createCounter\`函数返回的匿名函数形成了一个闭包，它可以访问\`createCounter\`函数作用域中的\`count\`变量。`,"如何使用Vue组合式API创建自定义Hook？":`Vue 3的组合式API允许我们创建可复用的逻辑单元，称为"组合函数"或"Hook"。以下是创建自定义Hook的步骤：

\`\`\`javascript
// useCounter.js
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubled = computed(() => count.value * 2);
  
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  return {
    count,
    doubled,
    increment,
    decrement
  };
}
\`\`\`

使用这个Hook：

\`\`\`javascript
// 在组件中
import { useCounter } from './useCounter';

export default {
  setup() {
    const { count, doubled, increment, decrement } = useCounter(10);
    
    return {
      count,
      doubled,
      increment,
      decrement
    };
  }
};
\`\`\``,"帮我理解CSS Grid和Flexbox的区别":`CSS Grid和Flexbox都是强大的布局工具，但它们有不同的设计目标和使用场景：

**Flexbox（弹性盒子）**：
- 一维布局系统，主要处理行或列的排列
- 适合组件内部元素的布局
- 更容易对齐元素和分配空间
- 对不确定大小的内容非常有效

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

**Grid（网格）**：
- 二维布局系统，同时处理行和列
- 适合整体页面布局
- 可以精确控制元素在二维空间中的位置
- 适合复杂的布局结构

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

**最佳实践**：结合使用两者，Grid用于整体页面布局，Flexbox用于组件内部布局。`};let u="我是一个模拟的AI助手，无法提供真实的回答。在实际应用中，这里应该连接到真正的AI模型API。";for(const m in i)if(t.includes(m)){u=i[m];break}this.isTyping=!1,this.selectedChat.messages.push({text:u,sender:"ai",time:this.formatTime(new Date)}),this.$nextTick(()=>{this.scrollToBottom()})},startNewChat(){this.chatHistory.unshift({title:"新的会话",date:this.formatDate(new Date),messages:[]}),this.selectedChatIndex=0,this.$nextTick(()=>{this.$refs.chatInput&&this.$refs.chatInput.focus()})},selectChat(t){this.selectedChatIndex=t,this.$nextTick(()=>{this.scrollToBottom()})},deleteChat(t){confirm("确定要删除这个会话吗？")&&(this.chatHistory.splice(t,1),this.chatHistory.length===0?this.startNewChat():t<=this.selectedChatIndex&&(this.selectedChatIndex=Math.max(0,this.selectedChatIndex-1)))},formatDate(t){return new Intl.DateTimeFormat("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit"}).format(t)},formatTime(t){return new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit"}).format(t)},formatMessage(t){return t.replace(/```(.*?)\n([\s\S]*?)```/g,'<pre class="code-block"><code>$2</code></pre>')},usePromptSuggestion(t){this.userInput=t.text,this.sendMessage()},scrollToBottom(){this.$refs.messagesContainer&&(this.$refs.messagesContainer.scrollTop=this.$refs.messagesContainer.scrollHeight)}}},a=t=>(b("data-v-3d2d41c6"),t=t(),T(),t),H={class:"ai-container"},A=a(()=>e("div",{class:"ai-header"},[e("div",{class:"container"},[e("h1",{class:"ai-title"},"AI 助手"),e("p",{class:"ai-subtitle"},"通过人工智能辅助您的学习和开发")])],-1)),M={class:"container main-content-area"},V={class:"ai-chat-container"},D={class:"chat-sidebar"},N={class:"chat-header"},F=a(()=>e("h3",null,"会话历史",-1)),B=a(()=>e("i",{class:"fas fa-plus"},null,-1)),P={class:"chat-history"},j=["onClick"],G=a(()=>e("div",{class:"chat-icon"},[e("i",{class:"fas fa-comment-alt"})],-1)),J={class:"chat-info"},L={class:"chat-title"},z={class:"chat-date"},R=["onClick"],E=a(()=>e("i",{class:"fas fa-trash-alt"},null,-1)),K=[E],O={key:0,class:"no-history"},U=a(()=>e("i",{class:"fas fa-comments"},null,-1)),q=a(()=>e("p",null,"没有聊天记录",-1)),Q=[U,q],W={class:"chat-main"},X={class:"chat-messages",ref:"messagesContainer"},Y={key:0,class:"welcome-message"},Z=a(()=>e("div",{class:"welcome-header"},[e("img",{src:w,alt:"AI Logo",class:"ai-logo"}),e("h2",null,"AI学习助手")],-1)),$=a(()=>e("p",null,"您好！我是您的AI学习助手，可以帮助您：",-1)),ee={class:"suggestion-grid"},te=["onClick"],se={class:"suggestion-text"},ne={class:"message-avatar"},ae={class:"message-content"},ie=["innerHTML"],oe={class:"message-time"},ce={key:1,class:"message ai-message typing"},re=a(()=>e("div",{class:"message-avatar"},[e("i",{class:"fas fa-robot"})],-1)),le=a(()=>e("div",{class:"message-content"},[e("div",{class:"typing-indicator"},[e("span"),e("span"),e("span")])],-1)),de=[re,le],he={class:"chat-input-container"},ue=["disabled"],me=a(()=>e("i",{class:"fas fa-paper-plane"},null,-1)),_e=[me];function pe(t,i,u,m,r,n){return o(),c("div",H,[A,e("div",M,[e("div",V,[e("div",D,[e("div",N,[F,e("button",{class:"new-chat-btn",onClick:i[0]||(i[0]=(...s)=>n.startNewChat&&n.startNewChat(...s))},[B,I(" 新会话 ")])]),e("div",P,[(o(!0),c(_,null,p(r.chatHistory,(s,l)=>(o(),c("div",{key:l,onClick:g=>n.selectChat(l),class:d(["chat-item",r.selectedChatIndex===l?"active":""])},[G,e("div",J,[e("div",L,h(s.title),1),e("div",z,h(s.date),1)]),e("button",{class:"delete-chat-btn",onClick:v(g=>n.deleteChat(l),["stop"])},K,8,R)],10,j))),128)),r.chatHistory.length===0?(o(),c("div",O,Q)):f("",!0)])]),e("div",W,[e("div",X,[n.selectedChat.messages.length===0?(o(),c("div",Y,[Z,$,e("div",ee,[(o(!0),c(_,null,p(r.suggestions,(s,l)=>(o(),c("div",{key:l,class:"suggestion-item",onClick:g=>n.usePromptSuggestion(s)},[e("i",{class:d(["fas",s.icon])},null,2),e("div",se,h(s.text),1)],8,te))),128))])])):f("",!0),(o(!0),c(_,null,p(n.selectedChat.messages,(s,l)=>(o(),c("div",{key:l,class:d(["message",s.sender==="user"?"user-message":"ai-message"])},[e("div",ne,[e("i",{class:d(["fas",s.sender==="user"?"fa-user":"fa-robot"])},null,2)]),e("div",ae,[e("div",{class:"message-text",innerHTML:n.formatMessage(s.text)},null,8,ie),e("div",oe,h(s.time),1)])],2))),128)),r.isTyping?(o(),c("div",ce,de)):f("",!0)],512),e("div",he,[x(e("textarea",{"onUpdate:modelValue":i[1]||(i[1]=s=>r.userInput=s),onKeydown:i[2]||(i[2]=k(v((...s)=>n.sendMessage&&n.sendMessage(...s),["prevent"]),["enter"])),placeholder:"输入您的问题...",class:"chat-input",ref:"chatInput"},null,544),[[y,r.userInput]]),e("button",{class:"send-btn",onClick:i[3]||(i[3]=(...s)=>n.sendMessage&&n.sendMessage(...s)),disabled:r.userInput.trim()===""},_e,8,ue)])])])])])}const ge=C(S,[["render",pe],["__scopeId","data-v-3d2d41c6"]]);export{ge as default};
