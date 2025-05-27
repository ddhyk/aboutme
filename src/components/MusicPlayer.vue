<template>
  <div class="floating-player">
    <div class="player-card">
      <div class="album-art">
        <img src="/images/logo-1.png" alt="Album Art">
        <div class="vinyl-ring" :class="{ 'rotating': isPlaying }"></div>
      </div>
      
      <div class="song-info">
        <p class="now-playing">正在播放</p>
        <p class="song-title">天赋飞行</p>
      </div>
      
      <div class="controls">
        <button class="control-btn play-pause" @click="togglePlay">
          <i :class="['fas', isPlaying ? 'fa-pause' : 'fa-play']"></i>
        </button>
        <button class="control-btn next" @click="nextTrack">
          <i class="fas fa-step-forward"></i>
        </button>
      </div>
    </div>
    
    <audio 
      ref="audioPlayer"
      src="/bgm/天赋飞行.mp3"
      @timeupdate="updateTime"
      @ended="handleEnded"
    ></audio>
  </div>
</template>

<script>
export default {
  name: 'MusicPlayer',
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      isMuted: false
    }
  },
  mounted() {
    // 从localStorage恢复播放状态
    this.restorePlayerState();
    
    // 监听页面关闭事件
    window.addEventListener('beforeunload', this.savePlayerState);
  },
  beforeUnmount() {
    // 移除事件监听
    window.removeEventListener('beforeunload', this.savePlayerState);
  },
  methods: {
    restorePlayerState() {
      const audioPlayer = this.$refs.audioPlayer;
      
      // 恢复音量
      const savedVolume = localStorage.getItem('musicPlayerVolume');
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
        audioPlayer.volume = this.volume;
      } else {
        audioPlayer.volume = this.volume;
      }
      
      // 恢复静音状态
      const savedMuted = localStorage.getItem('musicPlayerMuted');
      if (savedMuted !== null) {
        this.isMuted = savedMuted === 'true';
        audioPlayer.muted = this.isMuted;
      }
      
      // 恢复播放位置
      const savedTime = localStorage.getItem('musicPlayerCurrentTime');
      if (savedTime !== null) {
        audioPlayer.currentTime = parseFloat(savedTime);
      }
      
      // 如果之前在播放，继续播放
      const wasPlaying = localStorage.getItem('musicPlayerIsPlaying') === 'true';
      if (wasPlaying) {
        // 延迟尝试播放，以避免浏览器策略限制
        setTimeout(() => {
          this.playAudio();
        }, 1000);
      }
    },
    
    savePlayerState() {
      const audioPlayer = this.$refs.audioPlayer;
      localStorage.setItem('musicPlayerCurrentTime', audioPlayer.currentTime.toString());
      localStorage.setItem('musicPlayerIsPlaying', this.isPlaying.toString());
      localStorage.setItem('musicPlayerVolume', this.volume.toString());
      localStorage.setItem('musicPlayerMuted', this.isMuted.toString());
    },
    
    togglePlay() {
      if (this.isPlaying) {
        this.pauseAudio();
      } else {
        this.playAudio();
      }
    },
    
    playAudio() {
      const audioPlayer = this.$refs.audioPlayer;
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          localStorage.setItem('musicPlayerIsPlaying', 'true');
        }).catch(error => {
          console.error('播放失败:', error);
        });
      }
    },
    
    pauseAudio() {
      const audioPlayer = this.$refs.audioPlayer;
      audioPlayer.pause();
      this.isPlaying = false;
      localStorage.setItem('musicPlayerIsPlaying', 'false');
    },
    
    nextTrack() {
      // 简化版本，只重置当前歌曲
      const audioPlayer = this.$refs.audioPlayer;
      audioPlayer.currentTime = 0;
      this.playAudio();
    },
    
    updateTime() {
      const audioPlayer = this.$refs.audioPlayer;
      this.currentTime = audioPlayer.currentTime;
      
      // 定期保存当前播放位置
      if (Math.round(this.currentTime) % 5 === 0) { // 每5秒保存一次
        this.savePlayerState();
      }
    },
    
    handleEnded() {
      this.isPlaying = false;
      localStorage.setItem('musicPlayerIsPlaying', 'false');
      localStorage.setItem('musicPlayerCurrentTime', '0');
      // 自动重新播放
      setTimeout(() => {
        this.playAudio();
      }, 1500);
    }
  }
}
</script>

<style scoped>
.floating-player {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.player-card {
  background: linear-gradient(135deg, #9370DB, #ff00ff);
  border-radius: 16px;
  padding: 12px 15px;
  width: 280px;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
}

.album-art {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vinyl-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.rotating {
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.song-info {
  flex: 1;
  padding-right: 10px;
}

.now-playing {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.song-title {
  font-size: 1rem;
  color: white;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 767px) {
  .floating-player {
    bottom: 20px;
    right: 20px;
  }
  
  .player-card {
    width: 240px;
    padding: 10px 12px;
  }
  
  .album-art {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  
  .song-title {
    font-size: 0.9rem;
  }
  
  .control-btn {
    width: 28px;
    height: 28px;
  }
}
</style> 