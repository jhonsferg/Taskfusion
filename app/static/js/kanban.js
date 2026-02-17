class KanbanBoard {
  constructor() {
    this.currentProjectId = null;
    this.projects = [];
    this.tasks = [];
    this.sortableInstances = [];
    this.init();
  }

  init() {
    this.cacheElements();
    this.attachEventListeners();
    this.loadProjects();
    this.initSortable();
  }

  cacheElements() {
    this.elements = {
      projectSelect: document.getElementById('projectSelect'),
      createTaskBtn: document.getElementById('createTaskBtn'),
      createProjectForm: document.getElementById('createProjectForm'),
      taskForm: document.getElementById('taskForm'),
      columns: {
        backlog: document.getElementById('backlogColumn'),
        inProgress: document.getElementById('inProgressColumn'),
        done: document.getElementById('doneColumn')
      },
      counts: {
        backlog: document.getElementById('backlogCount'),
        inProgress: document.getElementById('inProgressCount'),
        done: document.getElementById('doneCount')
      }
    };
  }

  attachEventListeners() {
    this.elements.projectSelect.addEventListener('change', (e) => {
      this.selectProject(e.target.value);
    });

    this.elements.createTaskBtn.addEventListener('click', () => {
      this.openTaskModal();
    });

    this.elements.createProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.createProject();
    });

    this.elements.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTask();
    });
  }

  initSortable() {
    Object.values(this.elements.columns).forEach(column => {
      const sortable = Sortable.create(column, {
        group: 'tasks',
        animation: 200,
        ghostClass: 'task-card--ghost',
        dragClass: 'task-card--drag',
        onEnd: (evt) => this.handleTaskMove(evt)
      });
      this.sortableInstances.push(sortable);
    });
  }

  async loadProjects() {
    try {
      Loading.show();
      this.projects = await API.get('/projects/');
      this.renderProjectSelect();
      
      if (this.projects.length > 0) {
        this.selectProject(this.projects[0].id);
      }
    } catch (error) {
      Toast.error('Error al cargar proyectos');
    } finally {
      Loading.hide();
    }
  }

  renderProjectSelect() {
    const options = this.projects.map(project => 
      `<option value="${project.id}">${project.name}</option>`
    ).join('');
    
    this.elements.projectSelect.innerHTML = 
      '<option value="">Seleccionar proyecto...</option>' + options;
  }

  async selectProject(projectId) {
    if (!projectId) {
      this.currentProjectId = null;
      this.elements.createTaskBtn.disabled = true;
      this.clearBoard();
      return;
    }

    this.currentProjectId = parseInt(projectId);
    this.elements.createTaskBtn.disabled = false;
    await this.loadTasks();
  }

  async loadTasks() {
    try {
      Loading.show();
      this.tasks = await API.get(`/tasks/?project_id=${this.currentProjectId}`);
      this.renderTasks();
      this.updateCounts();
    } catch (error) {
      Toast.error('Error al cargar tareas');
    } finally {
      Loading.hide();
    }
  }

  renderTasks() {
    this.clearBoard();
    
    this.tasks.forEach(task => {
      const taskCard = this.createTaskCard(task);
      const column = this.elements.columns[this.getColumnKey(task.status)];
      column.appendChild(taskCard);
    });
  }

  createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.taskId = task.id;
    
    const isOverdue = Utils.isOverdue(task.due_date) && task.status !== 'done';
    const priorityClass = `task-card__priority--${task.priority}`;
    
    card.innerHTML = `
      <div class="task-card__header">
        <div class="task-card__title">${this.escapeHtml(task.title)}</div>
        <div class="task-card__actions">
          <button class="task-card__action" onclick="kanban.editTask(${task.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="task-card__action task-card__action--delete" onclick="kanban.deleteTask(${task.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      ${task.description ? `<div class="task-card__description">${this.escapeHtml(task.description)}</div>` : ''}
      <div class="task-card__footer">
        <span class="task-card__priority ${priorityClass}">
          <i class="fas fa-flag"></i>
          ${Utils.getPriorityLabel(task.priority)}
        </span>
        ${task.due_date ? `
          <span class="task-card__due-date ${isOverdue ? 'task-card__due-date--overdue' : ''}">
            <i class="fas ${isOverdue ? 'fa-exclamation-circle' : 'fa-calendar'}"></i>
            ${Utils.formatRelativeDate(task.due_date)}
          </span>
        ` : ''}
      </div>
    `;
    
    return card;
  }

  getColumnKey(status) {
    const map = {
      backlog: 'backlog',
      in_progress: 'inProgress',
      done: 'done'
    };
    return map[status] || 'backlog';
  }

  updateCounts() {
    const counts = {
      backlog: 0,
      inProgress: 0,
      done: 0
    };

    this.tasks.forEach(task => {
      const key = this.getColumnKey(task.status);
      counts[key]++;
    });

    Object.keys(counts).forEach(key => {
      const element = this.elements.counts[key];
      const currentCount = parseInt(element.textContent);
      if (currentCount !== counts[key]) {
        Utils.animateValue(element, currentCount, counts[key], 500);
      }
    });
  }

  async handleTaskMove(evt) {
    const taskId = parseInt(evt.item.dataset.taskId);
    const newStatus = evt.to.dataset.status;
    
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = newStatus;
      }
      
      this.updateCounts();
      Toast.success('Tarea actualizada');
    } catch (error) {
      Toast.error('Error al mover tarea');
      await this.loadTasks();
    }
  }

  async createProject() {
    const projectData = {
      name: document.getElementById('projectName').value,
      description: document.getElementById('projectDescription').value
    };

    try {
      Loading.show();
      const newProject = await API.post('/projects/', projectData);
      this.projects.push(newProject);
      this.renderProjectSelect();
      this.elements.projectSelect.value = newProject.id;
      this.selectProject(newProject.id);
      
      Modal.hide();
      this.elements.createProjectForm.reset();
      Toast.success('Proyecto creado exitosamente');
    } catch (error) {
      Toast.error('Error al crear proyecto');
    } finally {
      Loading.hide();
    }
  }

  openTaskModal(task = null) {
    const modalTitle = document.getElementById('taskModalTitle');
    const form = this.elements.taskForm;
    
    if (task) {
      modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Tarea';
      this.populateTaskForm(task);
    } else {
      modalTitle.innerHTML = '<i class="fas fa-tasks"></i> Nueva Tarea';
      form.reset();
      document.getElementById('taskId').value = '';
      document.getElementById('taskStatus').value = 'backlog';
    }
    
    Modal.show('taskModal');
  }

  populateTaskForm(task) {
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    
    if (task.due_date) {
      const date = dayjs(task.due_date).format('YYYY-MM-DDTHH:mm');
      document.getElementById('taskDueDate').value = date;
    }
  }

  async saveTask() {
    const taskId = document.getElementById('taskId').value;
    const taskData = {
      title: document.getElementById('taskTitle').value,
      description: document.getElementById('taskDescription').value,
      priority: document.getElementById('taskPriority').value,
      status: document.getElementById('taskStatus').value,
      project_id: this.currentProjectId
    };

    const dueDate = document.getElementById('taskDueDate').value;
    if (dueDate) {
      taskData.due_date = new Date(dueDate).toISOString();
    }

    try {
      Loading.show();
      
      if (taskId) {
        await API.put(`/tasks/${taskId}`, taskData);
        Toast.success('Tarea actualizada');
      } else {
        await API.post('/tasks/', taskData);
        Toast.success('Tarea creada');
      }
      
      await this.loadTasks();
      Modal.hide();
      this.elements.taskForm.reset();
    } catch (error) {
      Toast.error('Error al guardar tarea');
    } finally {
      Loading.hide();
    }
  }

  async editTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.openTaskModal(task);
    }
  }

  async deleteTask(taskId) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) {
      return;
    }

    try {
      Loading.show();
      await API.delete(`/tasks/${taskId}`);
      await this.loadTasks();
      Toast.success('Tarea eliminada');
    } catch (error) {
      Toast.error('Error al eliminar tarea');
    } finally {
      Loading.hide();
    }
  }

  clearBoard() {
    Object.values(this.elements.columns).forEach(column => {
      column.innerHTML = '';
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

let kanban;
document.addEventListener('DOMContentLoaded', () => {
  kanban = new KanbanBoard();
});
