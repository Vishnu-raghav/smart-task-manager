import { getTodos, saveTodos } from "./storage.js";

const form = document.getElementById("todoForm");
const todoCardSection = document.querySelector(".task-card-section");
const completedTaskSection = document.querySelector(".complete-tasks-section");
const addTaskBtn = document.querySelector(".Add-Task");


const todoModal = document.getElementById("todoModal");
const modalHeading = todoModal.querySelector(".modal-header h4");
const modalSubmitBtn = todoModal.querySelector('button[type="submit"]');
let editTodoId = null;
let originalTodoData =null

console.log("dashboard.js loaded");

export function isFormValid(){
  return (
    form.title.value.trim() !== "" &&
    form.priority.value.trim() !== "" 
  )
}

export function isEditChanged(){
  if(!originalTodoData) return false

  return(
    form.title.value !== originalTodoData.title ||
    form.desc.value !== originalTodoData.desc ||
    form.priority.value !== originalTodoData.priority ||
    form.category.value !== originalTodoData.category ||
    form.dueDate.value !== originalTodoData.dueDate 
  );
  
}

function createTodo() {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const newTodo = {
    id: Date.now(),
    title: data.title,
    description: data.desc,
    image: previewImg.src || null,
    priority: data.priority,
    category: data.category,
    dueDate: data.dueDate,
    completed: false,
  };

  const todos = getTodos();
  todos.push(newTodo);
  saveTodos(todos);

  form.reset();
  previewImg.src = "";
  previewImg.style.display = "none";
  document.querySelector(".upload-content").style.display = "flex";

  renderTodos();
  renderCompletedTodos();
}

export function renderTodos() {
  if (!todoCardSection) return;

  todoCardSection.innerHTML = "";

  const todos = getTodos();

  todos.forEach(task => {
    if (task.completed) return; 

    const card = document.createElement("div");
    card.className = "todo-card";
    card.dataset.id = task.id
    card.innerHTML = `
     <div class="card-header">
             <div class="actions">
               <i class="fa-solid fa-ellipsis icon"></i>
              <div class="card-popup">
                <ul class="card-actions">
                  <li class="card-action delete">Delete</li>
                  <li class="card-action edit">Edit</li>
                </ul>
              </div>
             </div>
      </div>
      <div class="task-card">
        <div class="task-checkbox">
          <input type="checkbox" data-id="${task.id}">
        </div>
        <div class="task-details">
          <span>${task.title || "No title"}</span>
          <p>${task.description || "No description"}</p>
        </div>

        ${task.image ? `
          <div class="img-card">
            <img class="task-img" src="${task.image}" alt="img">
          </div>` : ""}
      </div>

      <div class="task-Progress">
        <p class="progress-key">Category: <span class="progress-value">${task.category || "General"}</span></p>
        <p class="progress-key">Priority: <span class="progress-value">${task.priority}</span></p>
        <p class="progress-key">Status: <span class="progress-value">in progress</span></p>
        <p class="progress-key">Due: <span class="progress-value">${task.dueDate || "N/A"}</span></p>
      </div>
    `;

    todoCardSection.appendChild(card);
  });
}

export function renderCompletedTodos() {
    if (!completedTaskSection) return;

  completedTaskSection.innerHTML = "";

  const todos = getTodos();
  const completed = todos.filter(t => t.completed);

  if (completed.length === 0) {
    completedTaskSection.innerHTML = `<p style="padding:10px;color:#777;">No completed tasks</p>`;
    return;
  }

  completed.forEach(task => {
    const card = document.createElement("div");
    card.className = "todo-card";

    card.innerHTML = `
      <div class="card-header">
             <div class="actions">
               <i class="fa-solid fa-ellipsis icon"></i>
              <div class="card-popup">
                <ul class="card-actions">
                  <li class="card-action Delete">Delete</li>
                  <li class="card-action edit">Edit</li>
                </ul>
              </div>
             </div>
      </div>
      <div class="task-card">
        <div class="task-checkbox">
          <input type="checkbox" data-id="${task.id}" checked>
        </div>
        <div class="task-details">
          <span>${task.title}</span>
          <p>${task.description}</p>
        </div>

        ${task.image ? `
          <div class="img-card">
            <img class="task-img" src="${task.image}" alt="img">
          </div>` : ""}
      </div>

      <div class="task-Progress">
        <p class="progress-key">Category: <span class="progress-value">${task.category || "General"}</span></p>
        <p class="progress-key">Priority: <span class="progress-value">${task.priority}</span></p>
        <p class="progress-key">Status: <span class="progress-value">Completed</span></p>
        <p class="progress-key">Due: <span class="progress-value">${task.dueDate || "N/A"}</span></p>
      </div>
    `;

    completedTaskSection.appendChild(card);
  });
}

export function deleteTodo(e){
  const deleteBtn = e.target.closest(".delete")
  if(!deleteBtn) return

  const card = deleteBtn.closest(".todo-card")
  const id = Number(card.dataset.id)
  let todos = getTodos()
  todos = todos.filter((todo) => todo.id !== id)

  saveTodos(todos)
  renderTodos()
  renderCompletedTodos()
}

export function handleEditClick(e){
  const editBtn = e.target.closest(".edit");
  if(!editBtn) return;

  const card = editBtn.closest(".todo-card");
  const id = Number(card.dataset.id);

  const todos = getTodos();
  const todo = todos.find(t => t.id === id);

  editTodoId = id;

  form.title.value = todo.title;
  form.desc.value = todo.description;
  form.priority.value = todo.priority;
  form.category.value = todo.category
  form.dueDate.value = todo.dueDate;

  originalTodoData = {
    title: todo.title,
    desc: todo.description,
    priority: todo.priority,
    category: todo.category,
    dueDate: todo.dueDate
  };

  modalHeading.innerText = "Edit Task";
  modalSubmitBtn.innerText = "Update Task";

  modalSubmitBtn.disabled = true;

  todoModal.classList.add("active");
}

export function updateTodo(){
  const formData = new FormData(form)
  const data = Object.fromEntries(formData.entries())

  let todos = getTodos()

  todos = todos.map((todo) => {
    if(todo.id === editTodoId){
      return {
        ...todo,
        title: data.title,
        description: data.desc,
        priority: data.priority,
        category: data.category,
        dueDate: data.dueDate
      }
    }
    return todo
  })

  saveTodos(todos);

editTodoId = null;
originalTodoData = null;

form.reset();
modalSubmitBtn.disabled = true;

todoModal.classList.remove("active");

renderTodos();
renderCompletedTodos();
}

addTaskBtn.addEventListener("click", () => {
  editTodoId = null;
  originalTodoData = null

  form.reset();

  modalHeading.innerText = "Add New Task";
  modalSubmitBtn.innerText = "Done";

  modalSubmitBtn.disabled = true;

  todoModal.classList.add("active");
});

todoCardSection.addEventListener("click", (e) => {
  deleteTodo(e)
  handleEditClick(e);
})

document.addEventListener("change", (e) => {
  if (e.target.type !== "checkbox") return;

  const id = Number(e.target.dataset.id);
  const todos = getTodos();

  todos.forEach(todo => {
    if (todo.id === id) {
      todo.completed = e.target.checked;
    }
  });

  saveTodos(todos);
  renderTodos();
  renderCompletedTodos();
});

document.addEventListener("click", (e) => {
  const actions = e.target.closest(".actions");
  if (!actions) return;

  const popup = actions.querySelector(".card-popup");
  popup.classList.toggle("active");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
    if(editTodoId === null){
    createTodo();
  } else {
    updateTodo();
  }
});

form.addEventListener("input", () => {
  if (editTodoId === null) {
    modalSubmitBtn.disabled = !isFormValid();
  } else {
    modalSubmitBtn.disabled = !isEditChanged();
  }
});

  renderTodos();
  renderCompletedTodos();



