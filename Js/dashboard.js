import { rerenderPage } from "./app.js";
import { 
  getPriorities,
  getTodos,
  saveTodos,
  getCategories,
  initializePriorities,
  getFilterState
} from "./storage.js";

import { openEditTask, clearEditState, getEditState } from "./taskActions.js";
import {initForm,updateSubmitButtonState} from "./formUtils.js"
import {openConfirmModal} from "./actionsConfirm.js"

import {
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService
} from "./taskcrud.js";

import {populateOptions as populateCategoryOptions,} from "../utils/populateOptions.js"
import { filterTodos } from "./filter.js";

const form = document.getElementById("todoForm");
const todoCardSection = document.querySelector(".task-card-section");
const todoCardContainer = document.querySelector(".grid-container");
const completedTaskSection = document.querySelector(".complete-tasks-section");
const addTaskBtn = document.querySelector(".Add-Task");
const isDashboard = document.body.dataset.page === "dashboard";

const todoModal = document.getElementById("todoModal");
const modalHeading = todoModal.querySelector(".modal-header h4");
const modalSubmitBtn = todoModal.querySelector('button[type="submit"]');
const select = document.getElementById("task-category");


initializePriorities()

if (select) {
  populateCategoryOptions(select, getCategories(), {
    placeholderText: "Select Category"
  });
}

function formatDate(dateString){

    if(!dateString){
        return "No due date";
    }

    return new Date(dateString).toLocaleDateString("en-GB",{
        day:"numeric",
        month:"short",
        year:"numeric"
    });

}

function renderTodos(activeTodos) {
  if (!todoCardSection) return;

  todoCardSection.innerHTML = "";

  const categories = getCategories()
  const priorities = getPriorities()
  
  
  if (activeTodos.length === 0) {
    todoCardSection.innerHTML = `
      <div class="empty-state">
        <p>No tasks Click "Add Task" to get started</p>
      </div>
    `;
  
  }

  activeTodos.forEach(task => {
    const categoryObj = categories.find(c => c.id === Number(task.category));
    const categoryName = categoryObj ? categoryObj.name : "General";

    const priorityObj = priorities.find(p => p.id === Number(task.priority))
    const priorityName = priorityObj ? priorityObj.name : "Medium"


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
        <p class="progress-key">
        Priority:
         <span
           class="progress-value priority-pill"
           style="
             background:${priorityObj?.color || '#6b7280'};
             color:white;
           "
         >
           ${priorityName}
         </span>
        </p>
        <p class="progress-key">
        Status: <span class="progress-value">${task.completed ? `Complete` : `In progress`}</span>
        </p>
        <p class="progress-key">Due: <span class="progress-value">${formatDate(task.dueDate)}</span></p>
      </div>      
    `;

    todoCardSection.appendChild(card);
  });

}

 function renderCompletedTodos(completedTodos) {
  if (!completedTaskSection) return;

  completedTaskSection.innerHTML = "";

  const categories = getCategories()
  const priorities = getPriorities()


  if (completedTodos.length === 0) {
    completedTaskSection.innerHTML = `<p style="padding:10px;color:#777;">No completed tasks</p>`;
    return;
  }

  completedTodos.forEach(task => {

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
          <input type="checkbox" data-id="${task.id}" checked>
        </div>
        <div class="task-details">
          <span>${task.title}</span>
          <p>${task.desc}</p>
        </div>

        ${task.image ? `
          <div class="img-card">
            <img class="task-img" src="${task.image}" alt="img">
          </div>` : ""}
      </div>
    `;

    completedTaskSection.appendChild(card);
  });
}

export function deleteTodoHandle(id){

  if(Number.isNaN(id)) return

 openConfirmModal("Are you sure you want to delete this task?", () => {
 deleteTodoService(id)
 rerenderPage()
 })

}

 export function editTodoHandle(id){

  if(Number.isNaN(id)) return


  openEditTask(id, {
  form,
  modal: todoModal,
  modalHeading,
  submitBtn: modalSubmitBtn
  });

 }

function updateProgressUI(todos) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;

  const percent = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  document.querySelector(".progress-percent").innerText = `${percent}%`;

  const progressFill = document.querySelector(".progress-bar-fill");
  progressFill.style.width = `${percent}%`;

  const stats = document.querySelectorAll(".stat-value");
  stats[0].innerText = completed;
  stats[1].innerText = pending;

  const labels = document.querySelectorAll(".stat-label");
  labels[0].innerText = "Completed";
  labels[1].innerText = "Pending";


  if (total === 0) {
  document.querySelector(".progress-percent").innerText = "0%";
  progressFill.style.width = "0%";

  stats[0].innerText = 0;
  stats[1].innerText = 0;

  return;
}
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

todoCardContainer.addEventListener("click", (e) => {
  
  const deleteBtn = e.target.closest(".delete")
  
  if(deleteBtn){
    const card = deleteBtn.closest(".todo-card")
    if(!card) return

    const id = Number(card.dataset.id)
    deleteTodoHandle(id)
    return
  }
  
  const editBtn = e.target.closest(".edit");
  if (editBtn){
    const card = editBtn.closest(".todo-card")
    if(!card) return

    const id = Number(card.dataset.id)
    editTodoHandle(id)
    return
  }

  const actions = e.target.closest(".actions");
  if (actions) {
  const popup = actions.querySelector(".card-popup");
  if(!popup) return

  popup.classList.toggle("active");
  return
  }
  
  
  
});

todoCardContainer.addEventListener("change", (e) => {
  if(!isDashboard) return
  
  if (e.target.type !== "checkbox") return;
  
  const id = Number(e.target.dataset.id);
  const todos = getTodos();
  
  const todo = todos.find(t => t.id === id)
  
  if(todo){
    todo.completed = e.target.checked
  }
  
  saveTodos(todos);
  rerenderPage()
});

form.addEventListener("input",() => {
  updateSubmitButtonState(form,modalSubmitBtn)
})

export function renderDashboard() {
  const todos = getTodos();
  
  const selectedFilters = getFilterState();
  
  const filteredTodos = filterTodos(todos, selectedFilters);
  
  const activeTodos = filteredTodos.filter(todo => !todo.completed)
  
  const completedTodos = filteredTodos.filter(todo => todo.completed);
  
  renderTodos(activeTodos);
  
  renderCompletedTodos(completedTodos);
  
  updateProgressUI(todos);
}
