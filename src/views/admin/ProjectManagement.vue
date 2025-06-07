<template>
  <div class="project-management">
    <div class="page-header">
      <h1>项目管理</h1>
      <button class="add-project-btn" @click="openAddProjectModal">
        <i class="fas fa-plus"></i> 添加项目
      </button>
    </div>
    
    <!-- 项目列表 -->
    <div class="projects-container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>加载中，请稍候...</p>
      </div>
      
      <div v-else-if="projects.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-folder-open"></i>
        </div>
        <p>暂无项目</p>
        <button class="add-project-btn" @click="openAddProjectModal">
          <i class="fas fa-plus"></i> 添加第一个项目
        </button>
      </div>
      
      <div v-else class="projects-list">
        <div v-for="(project, index) in projects" :key="index" class="project-card">
          <div class="project-image">
            <img :src="project.image" :alt="project.title">
            <div class="project-tags">
              <span v-for="(tag, tagIndex) in project.tags" :key="tagIndex" class="project-tag">
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-date">
              <i class="far fa-calendar-alt"></i> {{ project.date }}
            </div>
            
            <div class="project-actions">
              <button class="action-btn edit-btn" @click="editProject(index)">
                <i class="fas fa-edit"></i> 编辑
              </button>
              <button class="action-btn delete-btn" @click="confirmDelete(index)">
                <i class="fas fa-trash-alt"></i> 删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑项目对话框 -->
    <div class="project-modal" v-if="showProjectModal" @click.self="cancelProjectModal">
      <div class="project-modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑项目' : '添加项目' }}</h3>
          <button class="close-btn" @click="cancelProjectModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="project-title">项目标题</label>
            <input type="text" id="project-title" v-model="currentProject.title" placeholder="输入项目标题">
          </div>
          
          <div class="form-group">
            <label for="project-description">项目描述</label>
            <textarea id="project-description" v-model="currentProject.description" rows="4" placeholder="输入项目描述"></textarea>
          </div>
          
          <div class="form-group">
            <label for="project-date">项目日期</label>
            <input type="text" id="project-date" v-model="currentProject.date" placeholder="例如：2023年3月">
          </div>
          
          <div class="form-group">
            <label for="project-image">项目图片URL</label>
            <input type="text" id="project-image" v-model="currentProject.image" placeholder="输入图片URL">
            <div class="image-preview" v-if="currentProject.image">
              <img :src="currentProject.image" alt="图片预览">
            </div>
          </div>
          
          <div class="form-group">
            <label for="project-link">项目链接URL</label>
            <input type="text" id="project-link" v-model="currentProject.link" placeholder="输入项目链接">
          </div>
          
          <div class="form-group">
            <label for="project-tags">项目标签</label>
            <div class="tags-input">
              <div v-for="(tag, index) in currentProject.tags" :key="index" class="tag-item">
                {{ tag }}
                <span class="tag-remove" @click="removeTag(index)">&times;</span>
              </div>
              <input 
                type="text" 
                v-model="newTag" 
                @keyup.enter="addTag" 
                placeholder="输入标签并回车"
                class="tag-input"
              >
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="cancelProjectModal">取消</button>
          <button class="save-btn" @click="saveProject" :disabled="isSaving">
            <i class="fas fa-spinner fa-spin" v-if="isSaving"></i>
            <span v-else>{{ isEditing ? '保存修改' : '添加项目' }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 确认删除对话框 -->
    <div class="confirm-modal" v-if="showDeleteConfirm" @click.self="cancelDelete">
      <div class="confirm-modal-content">
        <div class="confirm-header">
          <h3>确认删除</h3>
          <button class="close-btn" @click="cancelDelete">&times;</button>
        </div>
        
        <div class="confirm-body">
          <div class="warning-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p>确定要删除项目 "{{ projectToDelete ? projectToDelete.title : '' }}" 吗？</p>
          <p class="warning">此操作不可恢复！</p>
        </div>
        
        <div class="confirm-footer">
          <button class="cancel-btn" @click="cancelDelete">取消</button>
          <button class="delete-confirm-btn" @click="deleteProject" :disabled="isDeleting">
            <i class="fas fa-spinner fa-spin" v-if="isDeleting"></i>
            <span v-else>确认删除</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProjectManagement',
  data() {
    return {
      projects: [],
      isLoading: true,
      showProjectModal: false,
      showDeleteConfirm: false,
      isEditing: false,
      isSaving: false,
      isDeleting: false,
      currentProject: {
        title: '',
        description: '',
        image: '',
        date: '',
        tags: [],
        link: ''
      },
      newTag: '',
      editingIndex: -1,
      deleteIndex: -1,
      projectToDelete: null
    }
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/admin/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        this.projects = response.data.projects;
      } catch (error) {
        console.error('获取项目列表失败:', error);
        
        // 使用假数据（开发调试用）
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
    
    // 打开添加项目对话框
    openAddProjectModal() {
      this.isEditing = false;
      this.currentProject = {
        title: '',
        description: '',
        image: '',
        date: '',
        tags: [],
        link: ''
      };
      this.showProjectModal = true;
    },
    
    // 打开编辑项目对话框
    editProject(index) {
      this.isEditing = true;
      this.editingIndex = index;
      this.currentProject = JSON.parse(JSON.stringify(this.projects[index]));
      this.showProjectModal = true;
    },
    
    // 取消添加/编辑操作
    cancelProjectModal() {
      this.showProjectModal = false;
      this.currentProject = {
        title: '',
        description: '',
        image: '',
        date: '',
        tags: [],
        link: ''
      };
      this.newTag = '';
    },
    
    // 添加标签
    addTag() {
      if (this.newTag.trim()) {
        if (!this.currentProject.tags) {
          this.currentProject.tags = [];
        }
        this.currentProject.tags.push(this.newTag.trim());
        this.newTag = '';
      }
    },
    
    // 移除标签
    removeTag(index) {
      this.currentProject.tags.splice(index, 1);
    },
    
    // 保存项目
    async saveProject() {
      // 表单验证
      if (!this.currentProject.title || !this.currentProject.description || !this.currentProject.image) {
        alert('请填写必填字段：标题、描述和图片');
        return;
      }
      
      this.isSaving = true;
      
      try {
        if (this.isEditing) {
          // 更新项目
          await axios.put(`/api/admin/projects/${this.projects[this.editingIndex].id}`, this.currentProject, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          });
          
          // 更新本地数据
          this.projects[this.editingIndex] = { ...this.currentProject };
        } else {
          // 新增项目
          const response = await axios.post('/api/admin/projects', this.currentProject, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
          });
          
          // 添加到本地数据
          this.projects.unshift(response.data.project);
        }
        
        // 关闭对话框
        this.showProjectModal = false;
        this.currentProject = {
          title: '',
          description: '',
          image: '',
          date: '',
          tags: [],
          link: ''
        };
      } catch (error) {
        console.error('保存项目失败:', error);
        alert('保存失败，请重试');
        
        // TODO: 开发调试用（实际部署时删除）
        if (this.isEditing) {
          this.projects[this.editingIndex] = { ...this.currentProject };
        } else {
          this.projects.unshift({ ...this.currentProject, id: Date.now() });
        }
        this.showProjectModal = false;
      } finally {
        this.isSaving = false;
      }
    },
    
    // 确认删除项目
    confirmDelete(index) {
      this.deleteIndex = index;
      this.projectToDelete = this.projects[index];
      this.showDeleteConfirm = true;
    },
    
    // 取消删除
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.projectToDelete = null;
      this.deleteIndex = -1;
    },
    
    // 删除项目
    async deleteProject() {
      if (this.deleteIndex === -1) return;
      
      this.isDeleting = true;
      
      try {
        await axios.delete(`/api/admin/projects/${this.projects[this.deleteIndex].id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        
        // 从本地数据中移除
        this.projects.splice(this.deleteIndex, 1);
        this.showDeleteConfirm = false;
      } catch (error) {
        console.error('删除项目失败:', error);
        alert('删除失败，请重试');
        
        // TODO: 开发调试用（实际部署时删除）
        this.projects.splice(this.deleteIndex, 1);
        this.showDeleteConfirm = false;
      } finally {
        this.isDeleting = false;
      }
    }
  }
}
</script>

<style scoped>
.project-management {
  padding: 0;
  color: #333;
  font-family: 'Inter', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

.page-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
}

.add-project-btn {
  background-color: #9370DB;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(147, 112, 219, 0.2);
}

.add-project-btn i {
  margin-right: 8px;
}

.add-project-btn:hover {
  background-color: #8a61d4;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(147, 112, 219, 0.3);
}

/* 加载和空状态 */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #eaeaea;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(147, 112, 219, 0.3);
  border-radius: 50%;
  border-top-color: #9370DB;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state p {
  color: #888;
  margin-bottom: 25px;
  font-size: 1rem;
}

/* 项目列表 */
.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.project-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
}

.project-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-tags {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.project-tag {
  background-color: rgba(147, 112, 219, 0.9);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.project-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-title {
  margin: 0 0 12px 0;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
}

.project-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 20px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.project-date {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.project-date i {
  margin-right: 5px;
  color: #9370DB;
}

.project-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn i {
  margin-right: 6px;
}

.edit-btn {
  background-color: #f5f5f5;
  color: #555;
}

.edit-btn:hover {
  background-color: #e0e0e0;
  color: #333;
}

.delete-btn {
  background-color: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.delete-btn:hover {
  background-color: rgba(255, 107, 107, 0.2);
}

/* 项目模态框 */
.project-modal, .confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.project-modal-content, .confirm-modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
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

.modal-header, .confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eaeaea;
  background-color: #f8f9fa;
}

.modal-header h3, .confirm-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #333;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #999;
  cursor: pointer;
  transition: all 0.3s ease;
  line-height: 1;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  color: #333;
  background-color: rgba(0, 0, 0, 0.05);
  transform: rotate(90deg);
}

.modal-body {
  padding: 25px;
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

.form-group input, .form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #9370DB;
  box-shadow: 0 0 0 3px rgba(147, 112, 219, 0.2);
  background-color: #fff;
}

.image-preview {
  margin-top: 10px;
  max-width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 50px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.tags-input:focus-within {
  border-color: #9370DB;
  box-shadow: 0 0 0 3px rgba(147, 112, 219, 0.2);
  background-color: #fff;
}

.tag-item {
  background-color: rgba(147, 112, 219, 0.1);
  color: #9370DB;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(147, 112, 219, 0.2);
}

.tag-remove {
  margin-left: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 0.8;
  color: #9370DB;
  font-weight: bold;
}

.tag-input {
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  padding: 5px 0;
  font-size: 0.95rem;
  background-color: transparent;
}

.modal-footer, .confirm-footer {
  padding: 20px 25px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  background-color: #f8f9fa;
}

.cancel-btn {
  padding: 10px 18px;
  background-color: #f5f5f5;
  color: #555;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
  color: #333;
}

.save-btn {
  padding: 10px 18px;
  background-color: #9370DB;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(147, 112, 219, 0.2);
}

.save-btn:hover {
  background-color: #8a61d4;
  box-shadow: 0 6px 10px rgba(147, 112, 219, 0.3);
}

.save-btn:disabled, .delete-confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 确认删除对话框 */
.confirm-modal-content {
  max-width: 450px;
}

.confirm-body {
  padding: 30px 25px;
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.confirm-body p {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 1.1rem;
}

.warning {
  color: #ff6b6b;
  font-weight: 600;
  font-size: 0.95rem;
}

.delete-confirm-btn {
  padding: 10px 18px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(255, 107, 107, 0.2);
}

.delete-confirm-btn:hover {
  background-color: #ff5252;
  box-shadow: 0 6px 10px rgba(255, 107, 107, 0.3);
}

/* 响应式调整 */
@media (max-width: 992px) {
  .projects-list {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .projects-list {
    grid-template-columns: 1fr;
  }
  
  .project-image {
    height: 180px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-header h1 {
    margin-bottom: 15px;
  }
  
  .project-modal-content, .confirm-modal-content {
    max-width: 100%;
    border-radius: 0;
  }
}
</style> 