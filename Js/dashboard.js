import { rerenderPage } from "./app.js";
import { getTodos, saveTodos } from "./storage.js";
import { openEditTask, clearEditState } from "./taskActions.js";
import {initForm} from "./formUtils.js"
import {deleteTodo as deleteTodoService} from "./taskcrud.js";

const form = document.getElementById("todoForm");
const todoCardSection = document.querySelector(".task-card-section");
const completedTaskSection = document.querySelector(".complete-tasks-section");
const addTaskBtn = document.querySelector(".Add-Task");
const isDashboard = document.body.dataset.page === "dashboard";

const todoModal = document.getElementById("todoModal");
const modalHeading = todoModal.querySelector(".modal-header h4");
const modalSubmitBtn = todoModal.querySelector('button[type="submit"]');
import { getCategories } from "./storage.js";
populateCategoryOptions();


function populateCategoryOptions() {
  const select = document.getElementById("task-category");
  const categories = getCategories();

  select.innerHTML = ""; 

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    select.appendChild(option);
  });
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
           ${isDashboard ? `
          <div class="task-checkbox">
            <input type="checkbox" data-id="${task.id}">
          </div>
        ` : ""}
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

export function deleteTodoHandle(e){
 const deleteBtn = e.target.closest(".delete")
 if(!deleteBtn) return 

 const card = deleteBtn.closest(".todo-card")
 const id = Number(card.dataset.id)

 deleteTodoService(id)
 rerenderPage()
}

addTaskBtn.addEventListener("click", () => {
  form.reset();
  clearEditState();
  modalSubmitBtn.disabled = true;
  
  modalHeading.innerText = "Add New Task";
  modalSubmitBtn.innerText = "Done";
  
  todoModal.classList.add("active");
});

initForm(form, () => {
  rerenderPage();
});

todoCardSection.addEventListener("click", (e) => {
  
  if (e.target.closest(".delete")) {
    deleteTodoHandle(e);
    return;
  }
  
  const editBtn = e.target.closest(".edit");
  if (!editBtn) return;
  
  const card = editBtn.closest(".todo-card");
  const id = Number(card.dataset.id);
  
  openEditTask(id, {
  form,
  modal: todoModal,
  modalHeading,
  submitBtn: modalSubmitBtn
  });

});

document.addEventListener("change", (e) => {
  if(!isDashboard) return
  
  if (e.target.type !== "checkbox") return;

  const id = Number(e.target.dataset.id);
  const todos = getTodos();

  todos.forEach(todo => {
    if (todo.id === id) {
      todo.completed = e.target.checked;
    }
  });
  
  saveTodos(todos);
  rerenderPage()
});

document.addEventListener("click", (e) => {
  const actions = e.target.closest(".actions");
  if (!actions) return;
  
  const popup = actions.querySelector(".card-popup");
  popup.classList.toggle("active");
});





