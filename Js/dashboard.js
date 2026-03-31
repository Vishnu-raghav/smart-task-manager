import { rerenderPage } from "./app.js";
import { getPriorities, getTodos, saveTodos } from "./storage.js";
import { openEditTask, clearEditState, getEditState } from "./taskActions.js";
import {initForm} from "./formUtils.js"
import {openConfirmModal} from "./actionsConfirm.js"
import { getCategories, initializePriorities} from "./storage.js";

import {
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService
} from "./taskcrud.js";

import {populateOptions as populateCategoryOptions, populateOptions as populatePriorityOptions} from "../utils/populateOptions.js"


const form = document.getElementById("todoForm");
const todoCardSection = document.querySelector(".task-card-section");
const completedTaskSection = document.querySelector(".complete-tasks-section");
const addTaskBtn = document.querySelector(".Add-Task");
const isDashboard = document.body.dataset.page === "dashboard";

const todoModal = document.getElementById("todoModal");
const modalHeading = todoModal.querySelector(".modal-header h4");
const modalSubmitBtn = todoModal.querySelector('button[type="submit"]');
const select = document.getElementById("task-category");
const selectPriority = document.getElementById("task-priority") 

initializePriorities()

populateCategoryOptions(select , getCategories(), {
  placeholderText: "Select Category"
});


populatePriorityOptions(selectPriority, getPriorities(), {
  placeholderText:"Select Priority"
})


export function renderTodos() {
  if (!todoCardSection) return;

  todoCardSection.innerHTML = "";

  const todos = getTodos();
  const categories = getCategories()
  const priorities = getPriorities()

  if (todos.length === 0) {
    todoCardSection.innerHTML = `
      <div class="empty-state">
        <p>No tasks Click "Add Task" to get started</p>
      </div>
    `;
    return;
  }

  todos.forEach(task => {
    if (task.completed) return; 

    const categoryObj = categories.find(c => c.id === Number(task.category));
    const categoryName = categoryObj ? categoryObj.name : "General";

    const priorityObj = priorities.find(p => p.id === Number(task.priority))
    const priorityName = priorityObj ? priorityObj.name : "N/A"

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
          <p>${task.desc || "No description"}</p>
        </div>

        ${task.image ? `
          <div class="img-card">
            <img class="task-img" src="${task.image}" alt="img">
          </div>` : ""}
      </div>

      <div class="task-Progress">
        <p class="progress-key">Category: <span class="progress-value">${categoryName}</span></p>
        <p class="progress-key">Priority: <span class="progress-value">${priorityName}</span></p>
        <p class="progress-key">Status: <span class="progress-value">in progress</span></p>
        <p class="progress-key">Due: <span class="progress-value">${task.dueDate || "N/A"}</span></p>
      </div>
    `;

    todoCardSection.appendChild(card);
  });

  updateProgressUI();
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

 openConfirmModal("Are you sure you want to delete this task?", () => {
 deleteTodoService(id)
 rerenderPage()
 })
}


function updateProgressUI() {
  const todos = getTodos();

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // update UI
  document.querySelector(".progress-percent").innerText = percent + "%";
  document.querySelector(".progress-bar-fill").style.width = percent + "%";

  const stats = document.querySelectorAll(".stat-value");
  stats[0].innerText = completed;
  stats[1].innerText = pending;
}

addTaskBtn.addEventListener("click", () => {
  form.reset();
  clearEditState();
  modalSubmitBtn.disabled = true;
  
  modalHeading.innerText = "Add New Task";
  modalSubmitBtn.innerText = "Done";
  
  todoModal.classList.add("active");
});

initForm(form, {
  createFn: createTodoService,
  updateFn: updateTodoService,
  getEditState,
  clearEditState,
  onSuccess:  rerenderPage
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





