document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');

  // HTML страниц
  const pages = {
    about: `<div class="about-page"><h2>О проекте</h2><p>Приложение для управления задачами</p></div>`,
    list: `<div class="task-list"><h2>Список задач</h2><ul id="tasks-list"></ul></div>`,
    board: `
      <div class="task-board">
        <div class="board-header">
          <h2>Доска задач</h2>
          <button id="create-task-btn" class="btn btn-primary">
            <i class="icon-plus"></i> Создать задачу
          </button>
        </div>

        <div class="board-columns">
          <div class="column todo-column" data-status="todo">
            <div class="column-header">
              <h3><i class="icon-list"></i> To Do</h3>
              <span class="task-count">0</span>
            </div>
            <div class="tasks-container" id="todo-tasks"></div>
          </div>
          
          <div class="column progress-column" data-status="in-progress">
            <div class="column-header">
              <h3><i class="icon-loader"></i> In Progress</h3>
              <span class="task-count">0</span>
            </div>
            <div class="tasks-container" id="in-progress-tasks"></div>
          </div>
          
          <div class="column done-column" data-status="done">
            <div class="column-header">
              <h3><i class="icon-check"></i> Done</h3>
              <span class="task-count">0</span>
            </div>
            <div class="tasks-container" id="done-tasks"></div>
          </div>
        </div>
      </div>

      <!-- Модальное окно -->
      <div id="task-modal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h3>Новая задача</h3>
          <form id="task-form">
            <div class="form-group">
              <input type="text" id="task-title" placeholder="Название задачи" required>
            </div>
            <div class="form-group">
              <textarea id="task-description" placeholder="Описание"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Создать задачу</button>
          </form>
        </div>
      </div>
    `
  };

  // Функция загрузки страницы
  function loadPage(page) {
    const content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = pages[page] || `
      <div class="error">
        <h3>Страница не найдена</h3>
      </div>
    `;

    setActiveTab(page);
    
    if (page === 'board') {
      initTaskBoard();
    }
  }

  // Инициализация доски задач
  function initTaskBoard() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const modal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');

    // Обновление доски
    function updateBoard() {
      const columns = {
        todo: document.getElementById('todo-tasks'),
        'in-progress': document.getElementById('in-progress-tasks'),
        done: document.getElementById('done-tasks')
      };

      // Очищаем колонки
      Object.values(columns).forEach(col => col.innerHTML = '');

      // Сортируем задачи по статусу
      tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        columns[task.status].appendChild(taskCard);
      });

      // Обновляем счётчики задач
      document.querySelectorAll('.column').forEach(col => {
        const status = col.dataset.status;
        const count = tasks.filter(t => t.status === status).length;
        col.querySelector('.task-count').textContent = count;
      });

      // Сохраняем задачи
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Создание карточки задачи
    function createTaskCard(task) {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.draggable = true;
      card.dataset.taskId = task.id;

      card.innerHTML = `
        <div class="task-card-content">
          <h4>${task.title}</h4>
          ${task.description ? `<p>${task.description}</p>` : ''}
        </div>
        <div class="task-actions">
          <button class="btn-delete"><i class="icon-trash"></i></button>
        </div>
      `;

      // Drag and Drop
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
        setTimeout(() => card.classList.add('dragging'), 0);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      // Удаление задачи
      card.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        tasks = tasks.filter(t => t.id !== task.id);
        updateBoard();
      });

      return card;
    }

    // Настройка Drag and Drop
    document.querySelectorAll('.tasks-container').forEach(container => {
      container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
          const afterElement = getDragAfterElement(container, e.clientY);
          if (afterElement) {
            container.insertBefore(draggingCard, afterElement);
          } else {
            container.appendChild(draggingCard);
          }
        }
      });

      container.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = container.parentElement.dataset.status;
        
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          tasks[taskIndex].status = newStatus;
          updateBoard();
        }
      });
    });

    // Помощник для позиционирования при перетаскивании
    function getDragAfterElement(container, y) {
      const cards = [...container.querySelectorAll('.task-card:not(.dragging)')];
      
      return cards.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Модальное окно
    document.getElementById('create-task-btn').addEventListener('click', () => {
      modal.style.display = 'block';
    });

    document.querySelector('.close').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newTask = {
        id: Date.now().toString(),
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        status: 'todo'
      };
      
      tasks.push(newTask);
      updateBoard();
      modal.style.display = 'none';
      taskForm.reset();
    });

    // Инициализация
    updateBoard();
  }

  // Остальные функции (навигация и т.д.)
  function setActiveTab(activePage) {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.page === activePage);
    });
  }

  function initNavigation() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => loadPage(tab.dataset.page));
    });
  }

  // Запуск приложения
  initNavigation();
  loadPage('about');
});