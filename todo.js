let tasks = [];
let archivedTasks = [];
let darkMode = false; 

let showingArchived = false;

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  if (taskText) {
    tasks.push({
      text: taskText,
      category,
      priority,
      dueDate: dueDate || "No Due Date",
      completed: false,
    });
    taskInput.value = "";
    document.getElementById("dueDate").value = "";
    renderTasks();
    toggleFilterButtons();
    toggleSearchBar();
  } else {
    alert("Please enter a task.");
  }
}

function renderTasks(filter = "all", searchQuery = "") {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const listToRender = showingArchived ? archivedTasks : tasks;
  const filteredTasks = listToRender
    .filter((task) =>
      (filter === "completed"
        ? task.completed
        : filter === "pending"
        ? !task.completed
        : true) &&
      task.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.completed - b.completed);

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = task.completed ? "completed" : "";
    taskItem.classList.add(`${task.priority}-priority`);

    const taskText = document.createElement("span");
    taskText.innerText = `${task.text} - ${task.category} (${task.dueDate})`;

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("task-actions");

    if (!showingArchived) {
      const editButton = document.createElement("i");
      editButton.className = "fas fa-edit";
      editButton.title = "Edit Task";
      editButton.onclick = () => enableTaskEdit(index);

      const completeButton = document.createElement("button");
      completeButton.innerText = task.completed ? "Undo" : "Complete";
      completeButton.title = task.completed
        ? "Mark as Pending"
        : "Mark as Completed";
      completeButton.onclick = () => toggleCompleteTask(index);

      const deleteButton = document.createElement("i");
      deleteButton.className = "fas fa-trash";
      deleteButton.title = "Delete Task";
      deleteButton.onclick = () => deleteTask(index);

      const archiveButton = document.createElement("i");
      archiveButton.className = "fas fa-archive";
      archiveButton.title = "Archive Task";
      archiveButton.onclick = () => archiveTask(index);

      actionsDiv.append(editButton, completeButton, deleteButton, archiveButton);
    } else {
      const unarchiveButton = document.createElement("i");
      unarchiveButton.className = "fas fa-box-open";
      unarchiveButton.title = "Unarchive Task";
      unarchiveButton.onclick = () => unarchiveTask(index);

      const deleteButton = document.createElement("i");
      deleteButton.className = "fas fa-trash";
      deleteButton.title = "Delete Task";
      deleteButton.onclick = () => deleteTask(index, true);

      actionsDiv.append(unarchiveButton, deleteButton);
    }

    taskItem.append(taskText, actionsDiv);
    taskList.appendChild(taskItem);
  });
}

function enableTaskEdit(index) {
  const newTaskText = prompt("Edit your task:", tasks[index].text);
  if (newTaskText) {
    tasks[index].text = newTaskText.trim();
    renderTasks();
  }
}

function toggleCompleteTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index, fromArchived = false) {
  if (fromArchived) {
    archivedTasks.splice(index, 1);
  } else {
    tasks.splice(index, 1);
  }
  renderTasks();
  toggleFilterButtons();
  toggleSearchBar();
}

function archiveTask(index) {
  archivedTasks.push(tasks[index]);
  tasks.splice(index, 1);
  renderTasks();
  toggleFilterButtons();
  toggleSearchBar();
}

function unarchiveTask(index) {
  tasks.push(archivedTasks[index]);
  archivedTasks.splice(index, 1);
  renderTasks();
  toggleFilterButtons();
  toggleSearchBar();
}

function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode", darkMode);

  const backgroundAnimation = document.querySelector(".background-animation");
  backgroundAnimation.style.background = darkMode
    ? "linear-gradient(120deg, #243B55, #2C7744, #206A5D, #144552)"
    : "linear-gradient(120deg, #a1c4fd, #c2e9fb, #fbc2eb, #f3a683)";

  backgroundAnimation.style.backgroundSize = "400% 400%";
  backgroundAnimation.style.animation = "gradientAnimation 15s ease infinite";

  document.getElementById("darkModeToggle").innerText = darkMode
    ? "Light Mode"
    : "Dark Mode";
  updateTitle();
}

function toggleArchivedView() {
  showingArchived = !showingArchived;
  document.getElementById("archiveToggle").innerText = showingArchived
    ? "Show Unarchived"
    : "Show Archived";
  document.getElementById("inputSection").style.display = showingArchived
    ? "none"
    : "flex";
  renderTasks();
  updateTitle();
  toggleFilterButtons();
  toggleSearchBar();
}

function updateTitle() {
  const pageTitle = document.getElementById("pageTitle");
  pageTitle.innerText = showingArchived ? "Archived Tasks" : "To-Do List";
  pageTitle.style.color = darkMode ? "#ffffff" : "#333";
}

function filterTasks(status) {
  const searchQuery = document.getElementById("searchBar").value.trim();
  renderTasks(status, searchQuery);
}

function toggleFilterButtons() {
  const filterButtons = document.getElementById("filterButtons");
  filterButtons.style.display =
    !showingArchived && tasks.length > 0 ? "flex" : "none";
}

function toggleSearchBar() {
  const searchBar = document.getElementById("searchWrapper");
  searchBar.style.display = !showingArchived && tasks.length > 5 ? "block" : "none";
}

function searchTasks() {
  const searchQuery = document.getElementById("searchBar").value.trim();
  renderTasks("all", searchQuery);
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  toggleFilterButtons();
  toggleSearchBar();
}); 
