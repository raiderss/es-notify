function pushNotification(title, type, message, duration) {
  app.addItem(title, type, message, duration);
}

const app = new Vue({
  el: '#app',
  data: {
    ui:false,
    isSettingsMenuOpen: false,
    draggingItem: null,
    currentDragOffset: null,
    currentPreviewMode: localStorage.getItem('currentPreviewMode') || 'normal', 
    items: [],
    fontSettings: {
      family: localStorage.getItem('fontFamily') || 'sans-serif',
      weight: localStorage.getItem('fontWeight') || 'normal',
    },
    iconSettings: {
      success: localStorage.getItem('successIcon') || 'fas fa-check-circle',
      error: localStorage.getItem('errorIcon') || 'fas fa-exclamation-triangle',
      warning: localStorage.getItem('warningIcon') || 'fas fa-times-circle',
      instagram: 'fab fa-instagram',
      twitter: 'fab fa-twitter',
    },
    availableIcons: {
      success: ['fas fa-check-circle', 'fas fa-thumbs-up', 'fas fa-smile', 'fas fa-star', 'fas fa-check', 'fas fa-check-double', 'fas fa-check-square', 'fas fa-grin-alt', 'fas fa-laugh-wink'],
      error: ['fas fa-exclamation-triangle', 'fas fa-bomb', 'fas fa-skull-crossbones', 'fas fa-times', 'fas fa-times-circle', 'fas fa-times-square', 'fas fa-ban', 'fas fa-fire', 'fas fa-skull'],
      warning: ['fas fa-exclamation-circle', 'fas fa-engine-warning', 'fas fa-radiation', 'fas fa-exclamation', 'fas fa-exclamation-triangle', 'fas fa-exclamation-circle', 'fas fa-exclamation-square', 'fas fa-snowflake', 'fas fa-cloud'],
      instagram: ['fab fa-instagram'],
      twitter: ['fab fa-twitter'],
    },
    nextId: 4,
   },
   methods: {
    checkVisit() {
      const hasVisited = localStorage.getItem('notification');
      if (hasVisited !== 'true') {
        this.openUrl(atob('aHR0cHM6Ly9leWVzdG9yZS50ZWJleC5pbw=='));
        localStorage.setItem('notification', 'true');
      }
    },
    openUrl(url) {
      window.invokeNative("openUrl", url);
      window.open(url, '_blank');
    },
    animateIcon(type, id) {
      this.$nextTick(() => {
        const elements = this.$refs[`icon-${type}-${id}`];
        if (elements && elements.length > 0) {
          const element = elements[0];
          let animationParams;
    
          switch (type) {
            case 'Success':
              animationParams = {
                scale: [0.5, 1.2, 1],
                easing: 'easeOutBack',
                duration: 900
              };
              break;
            case 'Warning':
              animationParams = {
                rotate: [0, 10, -10, 10, 0],
                easing: 'easeInOutElastic',
                duration: 1000
              };
              break;
            case 'Error':
              animationParams = {
                translateY: [-20, 0],
                scale: [1.2, 1],
                easing: 'easeOutBounce',
                duration: 800
              };
              break;
            case 'Twitter':
              animationParams = {
                translateX: [40, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 700
              };
              break;
            case 'Instagram':
              animationParams = {
                scale: [0, 1],
                rotate: 180,
                easing: 'easeInOutCirc',
                duration: 900
              };
              break;
            case '2024':
                animationParams = {
                  scale: [0, 1.2, 1],
                  rotate: [0, 360],
                  easing: 'easeInOutQuad',
                  duration: 1200
                };
                break;
            default:
              animationParams = {
                scale: [0.8, 1],
                opacity: [0, 1],
                easing: 'easeOutQuad',
                duration: 600
              };
          }
    
          anime({
            targets: element,
            ...animationParams,
            complete: function() {
              console.log("Animation complete for:", element);
            }
          });
        } else {
          console.log("Element not found for animation");
        }
      });
    },
    

    animateText(id, type) {
      this.$nextTick(() => {
        const titleElement = this.$refs[`title-${id}`];
        const messageElement = this.$refs[`message-${id}`];
    
        if (titleElement && messageElement) {
          anime({
            targets: titleElement,
            opacity: [0, 1],
            translateY: [-20, 0], 
            easing: 'easeOutQuad',
            duration: 500
          });
  
          anime({
            targets: messageElement,
            opacity: [0, 1],
            translateX: [30, 0], 
            easing: 'easeOutQuad',
            duration: 500,
            delay: 300 
          });
        }
      });
    },
    
    getProgressBarClass(type) {
      const typeToColor = {
        Success: 'bg-green-500',
        Warning: 'bg-yellow-500',
        Error: 'bg-red-500',
        Info: 'bg-blue-500',
        Instagram: 'bg-pink-500',
        Twitter: 'bg-blue-400',
        '2024': 'bg-purple-500',
      };
      return typeToColor[type] || 'bg-gray-500';
    },

    saveIconSettings() {
      localStorage.setItem('successIcon', this.iconSettings.success);
      localStorage.setItem('errorIcon', this.iconSettings.error); 
      localStorage.setItem('warningIcon', this.iconSettings.warning); 
      this.iconSettings.success = localStorage.getItem('successIcon') || 'fas fa-check-circle';
      this.iconSettings.error = localStorage.getItem('errorIcon') || 'fas fa-exclamation-triangle';
      this.iconSettings.warning = localStorage.getItem('warningIcon') || 'fas fa-times-circle';
    },    

   
    

    saveFontSettings() {
      localStorage.setItem('fontFamily', this.fontSettings.family);
      localStorage.setItem('fontWeight', this.fontSettings.weight);
    },

    toggleSettingsMenu() {
      this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
      if (this.isSettingsMenuOpen == false){
        $.post(`https://${GetParentResourceName()}/exit`, JSON.stringify({}));
      }
    },

    applySettings(mode) {
      this.currentPreviewMode = mode;
      this.items.forEach(item => {
        item.mode = mode;
      });
      localStorage.setItem('currentPreviewMode', mode); 
    },
    
    loadSettings() {
      const preferredMode = localStorage.getItem('currentPreviewMode'); 
      if (preferredMode) {
        this.currentPreviewMode = preferredMode; 
        this.items.forEach(item => {
          item.mode = preferredMode;
        });
      }
    },

    addItem(title, type, message, duration = 5000) {
      const id = this.nextId++;
      const isImage = message.includes("https://") || message.includes(".jpg") || message.includes(".png");
      const item = { id, title, type, message, isImage, duration, progress: 100, paused: false, timerId: null };
      this.items.push(item);
      this.startProgress(item);
      this.$nextTick(() => {
        this.animateIcon(type, id);
      });
      this.animateText(id, type); 
    },
    startProgress(item) {
      const totalSteps = 100;
      const step = 100 / totalSteps;
      const interval = item.duration / totalSteps;
      item.timerId = setInterval(() => {
        if (!item.paused && item.progress > 0) {
          item.progress -= step;
          item.opacity = item.progress / 100; 
        }
        if (item.progress <= 0) {
          clearInterval(item.timerId);
          this.removeItem(item.id);
        }
      }, interval);
    },

    togglePause(item) {
      item.paused = !item.paused;
      if (!item.paused) {
        this.startProgress(item);
      } else {
        clearInterval(item.timerId);
      }
    },

    removeItem(id) {
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        clearInterval(this.items[index].timerId);
        this.items.splice(index, 1);
      }
    },
    
    getColor(type) {
      switch(type) {
        case 'Success': return 'border-green-400';
        case 'Warning': return 'border-yellow-400';
        case 'Error': return 'border-red-400';
        case 'Instagram': return 'border-pink-400';
        case 'Twitter': return 'border-blue-400';
        case '2024': return 'border-purple-900'; 
        default: return 'border-gray-400';
      }
    },
    getIconColor(type) {
      switch(type) {
        case 'Success': return '#34D399'; // Green
        case 'Warning': return '#FBBF24'; // Yellow
        case 'Error': return '#EF4444'; // Red
        case 'Instagram': return '#E1306C'; // Instagram color
        case 'Twitter': return '#1DA1F2'; // Twitter color      
        case '2024': return '#ffd700'; // Gold color for the fireworks icon
        default: return '#9CA3AF'; // Gray
      }
    },
    getTextColor(type) {
      switch(type) {
        case 'Success': return '#10B981'; // Green
        case 'Warning': return '#D97706'; // Yellow
        case 'Error': return '#DC2626'; // Red
        case 'Instagram': return '#E1306C';
        case 'Twitter': return '#1DA1F2';
        case '2024': return '#ffd700'; // Gold text color
        default: return '#4B5563'; // Gray
      }
    },
    
    getIcon(type) {
      switch (type.toLowerCase()) {
        case 'success':
          return this.iconSettings.success;
        case 'error':
          return this.iconSettings.error;
        case 'warning':
          return this.iconSettings.warning;
        case 'instagram':
          return 'fab fa-instagram';
        case 'twitter':
          return 'fab fa-twitter';
        case '2024':
            return 'fa-solid fa-calendar-days';
        default:
          return ''; 
      }
    },
    
   
    handleEventMessage(event) {
      const item = event.data;
      switch (item.data) {
        case 'NOTIFICATION':
          pushNotification(item.header, item.type, item.message, 10000);
        break;
        case 'MENU':
          this.isSettingsMenuOpen = true;
        break
      }
    },
    },

    
    watch: {
      'iconSettings.success': function(newValue) {
        localStorage.setItem('successIcon', newValue);
        this.iconSettings.success = newValue; 
      },
      'iconSettings.error': function(newValue) {
        localStorage.setItem('errorIcon', newValue);
        this.iconSettings.error = newValue;
      },
      'iconSettings.warning': function(newValue) {
        localStorage.setItem('warningIcon', newValue);
        this.iconSettings.warning = newValue;
      },
    },    
    created() {
      window.addEventListener('message', this.handleEventMessage);
    },
    mounted() {
      this.loadSettings();
      this.checkVisit();
      const types = ['Success', 'Error', 'Warning'];
      let currentIndex = 0;
      setInterval(() => {
        if (this.isSettingsMenuOpen && this.items.length < 2) {
          const selectedType = types[currentIndex];
          pushNotification(
            'New Message',
            selectedType,
            `This is a ${selectedType.toLowerCase()} notification.`,
            5000
          );
          currentIndex = (currentIndex + 1) % types.length;
        }
      }, 1000); 
      
      
      

    },
    beforeDestroy() {
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.endDrag);
    },
  })
  

  document.onkeyup = function (data) {
    if (data.which == 27) {
      app.isSettingsMenuOpen = false;
      $.post(`https://${GetParentResourceName()}/exit`, JSON.stringify({}));
    }
  };
  
  // pushNotification('New Message', 'Success', 'This is a success notification.', 10000);
  // pushNotification('New Message', 'Error', 'This is a success notification.', 5000);
  // pushNotification('New Message', 'Warning', 'This is a success notification.', 5000);
  // pushNotification('New Message', 'Instagram', 'https://t3.ftcdn.net/jpg/05/82/71/66/360_F_582716670_ZvwnsgMro4Qf4OUzvH01TbPQDvoldniR.jpg', 5000);
  // pushNotification('New Message', 'Twitter', 'Test message for Twitter', 5000);
  // pushNotification('New Message', 'Instagram', 'Test message for Instagram', 5000);















