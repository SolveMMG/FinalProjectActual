let tasks = [];
let archivedTasks = [];
let darkMode = false;
let showingArchived = false;

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;

  if (taskText) {
    tasks.push({
      text: taskText,
      category,
      priority,
      completed: false,
      isEditing: false,
    });
    taskInput.value = "";
    renderTasks();
    toggleFilterButtons();
  }
}

function renderTasks(filter = 'all') {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const listToRender = showingArchived ? archivedTasks : tasks;
  const filteredTasks = listToRender
    .filter(task => (filter === 'completed' ? task.completed : filter === 'pending' ? !task.completed : true))
    .sort((a, b) => a.completed - b.completed);

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = task.completed ? "completed" : "";
    taskItem.classList.add(`${task.priority}-priority`);

    const taskText = document.createElement("span");
    taskText.innerText = `${task.text} - ${task.category}`;

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("task-actions");

    if (!showingArchived) {
      const editButton = document.createElement("i");
      editButton.className = "fas fa-edit";
      editButton.onclick = () => enableTaskEdit(index);

      const completeButton = document.createElement("button");
      completeButton.innerHTML = task.completed ? "Undo" : "Complete";
      completeButton.onclick = () => toggleCompleteTask(index);

      const deleteButton = document.createElement("i");
      deleteButton.className = "fas fa-trash";
      deleteButton.onclick = () => deleteTask(index);

      const archiveButton = document.createElement("i");
      archiveButton.className = "fas fa-archive";
      archiveButton.onclick = () => archiveTask(index);

      actionsDiv.appendChild(editButton);
      actionsDiv.appendChild(completeButton);
      actionsDiv.appendChild(deleteButton);
      actionsDiv.appendChild(archiveButton);
    } else {
      const unarchiveButton = document.createElement("i");
      unarchiveButton.className = "fas fa-box-open";
      unarchiveButton.onclick = () => unarchiveTask(index);

      const deleteButton = document.createElement("i");
      deleteButton.className = "fas fa-trash";
      deleteButton.onclick = () => deleteTask(index);

      actionsDiv.appendChild(unarchiveButton);
      actionsDiv.appendChild(deleteButton);
    }

    taskItem.appendChild(taskText);
    taskItem.appendChild(actionsDiv);
    taskList.appendChild(taskItem);
  });
}

function archiveTask(index) {
  archivedTasks.push(tasks[index]);
  tasks.splice(index, 1);
  renderTasks();
  toggleFilterButtons();
}

function unarchiveTask(index) {
  tasks.push(archivedTasks[index]);
  archivedTasks.splice(index, 1);
  renderTasks();
  toggleFilterButtons();
}

function enableTaskEdit(index) {
  tasks[index].isEditing = true;
  renderTasks();
}

function saveTaskEdit(index, newText) {
  tasks[index].text = newText;
  tasks[index].isEditing = false;
  renderTasks();
}

function deleteTask(index) {
  if (showingArchived) {
    archivedTasks.splice(index, 1);
  } else {
    tasks.splice(index, 1);
  }
  renderTasks();
  toggleFilterButtons();
}

function toggleCompleteTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode", darkMode);
  document.getElementById("darkModeToggle").innerText = darkMode ? "Light Mode" : "Dark Mode";
  updateTitle();
}

function toggleArchivedView() {
  showingArchived = !showingArchived;
  document.getElementById("archiveToggle").innerText = showingArchived ? "Show Unarchived" : "Show Archived";
  document.getElementById("inputSection").style.display = showingArchived ? "none" : "flex";
  renderTasks();
  updateTitle();
  toggleFilterButtons();
}

function updateTitle() {
  const pageTitle = document.getElementById("pageTitle");
  pageTitle.innerText = showingArchived ? "Archived Tasks" : "To-Do List";
  pageTitle.style.color = darkMode ? "#ffffff" : "#333";
}

function filterTasks(status) {
  renderTasks(status);
}

function toggleFilterButtons() {
  const filterButtons = document.getElementById("filterButtons");
  filterButtons.style.display = (!showingArchived && tasks.length > 0) ? "flex" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  toggleFilterButtons();
});
