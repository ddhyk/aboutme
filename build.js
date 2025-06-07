#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 检查vite.js是否存在
const vitePath = path.resolve(__dirname, 'node_modules/vite/bin/vite.js');

try {
  if (fs.existsSync(vitePath)) {
    console.log('已找到vite.js文件');
  } else {
    console.error('找不到vite.js文件');
    process.exit(1);
  }

  // 执行构建命令
  console.log('开始构建项目...');
  execSync('node ./node_modules/vite/bin/vite.js build', { stdio: 'inherit' });
  console.log('构建成功!');
} catch (error) {
  console.error('构建失败:', error.message);
  process.exit(1);
} 