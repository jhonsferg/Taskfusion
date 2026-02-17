class Dashboard {
  constructor() {
    this.charts = {};
    this.refreshInterval = null;
    this.autoRefreshDelay = 30000;
    this.init();
  }

  init() {
    this.cacheElements();
    this.attachEventListeners();
    this.loadMetrics();
    this.startAutoRefresh();
  }

  cacheElements() {
    this.elements = {
      totalTasks: document.getElementById('totalTasks'),
      backlogTasks: document.getElementById('backlogTasks'),
      inProgressTasks: document.getElementById('inProgressTasks'),
      doneTasks: document.getElementById('doneTasks'),
      overdueTasks: document.getElementById('overdueTasks'),
      overdueProgress: document.getElementById('overdueProgress'),
      overdueAlert: document.getElementById('overdueAlert'),
      lastUpdate: document.getElementById('lastUpdate'),
      refreshBtn: document.getElementById('refreshBtn'),
      statusChart: document.getElementById('statusChart'),
      projectChart: document.getElementById('projectChart')
    };
  }

  attachEventListeners() {
    this.elements.refreshBtn.addEventListener('click', () => {
      this.loadMetrics();
    });
  }

  async loadMetrics() {
    try {
      this.setRefreshButtonLoading(true);
      const metrics = await API.get('/dashboard/metrics');
      this.updateMetrics(metrics);
      this.updateCharts(metrics);
      this.updateLastUpdateTime();
    } catch (error) {
      Toast.error('Error al cargar métricas');
    } finally {
      this.setRefreshButtonLoading(false);
    }
  }

  updateMetrics(metrics) {
    this.animateMetric(this.elements.totalTasks, metrics.total_tasks);
    this.animateMetric(this.elements.backlogTasks, metrics.tasks_by_status.backlog || 0);
    this.animateMetric(this.elements.inProgressTasks, metrics.tasks_by_status.in_progress || 0);
    this.animateMetric(this.elements.doneTasks, metrics.tasks_by_status.done || 0);
    this.animateMetric(this.elements.overdueTasks, metrics.overdue_tasks);

    this.updateOverdueAlert(metrics.overdue_tasks, metrics.total_tasks);
  }

  animateMetric(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== targetValue) {
      Utils.animateValue(element, currentValue, targetValue, 800);
    }
  }

  updateOverdueAlert(overdue, total) {
    const percentage = total > 0 ? (overdue / total) * 100 : 0;
    this.elements.overdueProgress.style.width = `${percentage}%`;

    if (overdue > 0) {
      this.elements.overdueAlert.style.display = 'flex';
      this.elements.overdueAlert.style.animation = 'pulse 2s infinite';
    } else {
      this.elements.overdueAlert.style.display = 'none';
    }
  }

  updateCharts(metrics) {
    this.updateStatusChart(metrics.tasks_by_status);
    this.updateProjectChart(metrics.tasks_by_project);
  }

  updateStatusChart(tasksByStatus) {
    const data = {
      labels: ['Backlog', 'En Progreso', 'Completado'],
      datasets: [{
        data: [
          tasksByStatus.backlog || 0,
          tasksByStatus.in_progress || 0,
          tasksByStatus.done || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 2
      }]
    };

    if (this.charts.status) {
      this.charts.status.data = data;
      this.charts.status.update('none');
    } else {
      this.charts.status = new Chart(this.elements.statusChart, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: {
                  size: 12,
                  weight: '500'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: {
                size: 14,
                weight: '600'
              },
              bodyFont: {
                size: 13
              },
              cornerRadius: 8
            }
          },
          cutout: '65%',
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
            easing: 'easeInOutQuart'
          }
        }
      });
    }
  }

  updateProjectChart(tasksByProject) {
    const projects = Object.keys(tasksByProject);
    const taskCounts = Object.values(tasksByProject);

    const data = {
      labels: projects,
      datasets: [{
        label: 'Tareas',
        data: taskCounts,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8
      }]
    };

    if (this.charts.project) {
      this.charts.project.data = data;
      this.charts.project.update('none');
    } else {
      this.charts.project = new Chart(this.elements.projectChart, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: {
                size: 14,
                weight: '600'
              },
              bodyFont: {
                size: 13
              },
              cornerRadius: 8
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: {
                  size: 11
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              ticks: {
                font: {
                  size: 11,
                  weight: '500'
                }
              },
              grid: {
                display: false
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          }
        }
      });
    }
  }

  updateLastUpdateTime() {
    const now = dayjs().format('DD/MM/YYYY HH:mm:ss');
    this.elements.lastUpdate.textContent = `Última actualización: ${now}`;
  }

  setRefreshButtonLoading(loading) {
    const btn = this.elements.refreshBtn;
    const icon = btn.querySelector('i');

    if (loading) {
      btn.disabled = true;
      icon.classList.add('fa-spin');
    } else {
      btn.disabled = false;
      icon.classList.remove('fa-spin');
    }
  }

  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      this.loadMetrics();
    }, this.autoRefreshDelay);
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}

let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new Dashboard();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    dashboard.stopAutoRefresh();
  } else {
    dashboard.loadMetrics();
    dashboard.startAutoRefresh();
  }
});
