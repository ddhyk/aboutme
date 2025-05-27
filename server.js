const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 设置静态文件目录指向dist（Vite构建输出目录）
app.use(express.static(path.join(__dirname, 'dist')));

// 处理API请求（如果有）
app.use('/api', (req, res) => {
  // API处理逻辑
  res.json({ message: 'API响应示例' });
});

// 所有其他请求都返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器已启动，访问地址: http://localhost:${port}`);
}); 