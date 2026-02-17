dayjs.extend(dayjs_plugin_relativeTime);
dayjs.locale('es');

const API = {
  BASE_URL: '/api',
  
  async request(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
};

const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toastContainer');
  },

  show(message, type = 'info', duration = 3000) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icon = this.getIcon(type);
    
    toast.innerHTML = `
      <div class="toast__icon">
        <i class="fas ${icon}"></i>
      </div>
      <div class="toast__content">
        <div class="toast__message">${message}</div>
      </div>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  getIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
  },

  success(message, duration) {
    this.show(message, 'success', duration);
  },

  error(message, duration) {
    this.show(message, 'error', duration);
  },

  info(message, duration) {
    this.show(message, 'info', duration);
  }
};

const Loading = {
  overlay: null,

  init() {
    this.overlay = document.getElementById('loadingOverlay');
  },

  show() {
    if (!this.overlay) this.init();
    this.overlay.classList.add('active');
  },

  hide() {
    if (!this.overlay) this.init();
    this.overlay.classList.remove('active');
  }
};

const Utils = {
  formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  },

  formatRelativeDate(dateString) {
    if (!dateString) return 'Sin fecha';
    return dayjs(dateString).fromNow();
  },

  isOverdue(dateString) {
    if (!dateString) return false;
    return dayjs(dateString).isBefore(dayjs());
  },

  getPriorityLabel(priority) {
    const labels = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta'
    };
    return labels[priority] || priority;
  },

  getStatusLabel(status) {
    const labels = {
      backlog: 'Backlog',
      in_progress: 'En Progreso',
      done: 'Completado'
    };
    return labels[status] || status;
  },

  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  animateValue(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.round(current);
    }, 16);
  }
};

const Modal = {
  current: null,

  show(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      this.current = new bootstrap.Modal(modalElement);
      this.current.show();
    }
  },

  hide() {
    if (this.current) {
      this.current.hide();
      this.current = null;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Loading.init();
});
