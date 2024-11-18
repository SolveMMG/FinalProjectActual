let tasks = [];
let filter = 'all';

function addTask() {
  const taskInput = document.getElementById('task-input');
  const dueDateInput = document.getElementById('due-date');
  const categorySelect = document.getElementById('category-select');

  if (taskInput.value === '') return alert('Task cannot be empty');

  const newTask = {
    id: Date.now(),
    text: taskInput.value,
    dueDate: dueDateInput.value,
    category: categorySelect.value,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = '';
  dueDateInput.value = '';
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  const newText = prompt('Edit task:', task.text);
  if (newText !== null) {
    task.text = newText;
    renderTasks();
  }
}

function toggleTaskCompletion(id) {
  const task = tasks.find(task => task.id === id);
  task.completed = !task.completed;
  renderTasks();
}

function filterTasks(status) {
  filter = status;
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = `task ${task.completed ? 'completed' : ''}`;
    
    taskItem.innerHTML = `
      <span>${task.text} - ${task.dueDate} (${task.category})</span>
      <div class="task-actions">
        <button onclick="toggleTaskCompletion(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });
}
