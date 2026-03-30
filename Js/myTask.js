import { getCategories, getTodos , saveTodos} from "./storage.js";
import {   clearEditState, getEditState ,openEditTask } from "./taskActions.js";
import {initForm} from "./formUtils.js"
import {openConfirmModal} from "./actionsConfirm.js"

import {
  deleteTodo as deleteTodoService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
} from "./taskcrud.js";

import {populateOptions as populateCategoryOptions} from "../utils/populateOptions.js"

const rightPanel = document.querySelector(".grid-right-area")
const listSection = document.querySelector(".task-card-section")
const form = document.getElementById("todoForm");
const addTaskBtn = document.querySelector(".Add-Task");
const todoModal = document.getElementById("todoModal");
const modalHeading = todoModal.querySelector(".modal-header h4");
const modalSubmitBtn = todoModal.querySelector('button[type="submit"]');
const select = document.getElementById("task-category");



populateCategoryOptions(select , getCategories(), {
  placeholderText: "Select Category"
});

export function renderTaskList() {
  const todos = getTodos();
  const category = getCategories()
  listSection.innerHTML = "";

  if (todos.length === 0) {
    listSection.innerHTML = `
      <div class="empty-state">
        <p>No tasks Click "Add Task" to get started</p>
      </div>
    `;
    return;
  }

  todos.forEach(task => {
    const categoryObj = category.find((cat) => cat.id == task.category)

    const div = document.createElement("div");
    div.className = "todo-card";
    div.dataset.id = task.id;
    div.innerHTML = `
<div 
   class="task-list-card"

>
  
  <!-- LEFT TEXT -->
  <div class="task-list-content">
    <span 
     class="task-list-title"
    >
      ${task.title || "No title"}
    </span>

    <p 
    class="task-list-desc"
    >
      ${task.desc || "No description"}
    </p>
  </div>

  ${
    task.image
      ? `
        <div 
        class="task-list-img"
        >
          <img 
            src="${task.image}" 
            alt="img"
            style="
              width:100%;
              height:100%;
              object-fit:cover;
            "
          />
        </div>
      `
      : ""
  }

</div>

<div 

>
  <span>
    Category:
    <b style="color:#222;">${categoryObj ? categoryObj.name : "General"}</b>
  </span>

  <span>
    Priority:
    <b style="color:#ff7a7a;">${task.priority}</b>
  </span>

  <span>
    Status:
    <b style="color:#666;">In progress</b>
  </span>

  <span>
    Due:
    <b style="color:#222;">${task.dueDate || "N/A"}</b>
  </span>
</div>
    `
    listSection.appendChild(div);
  });
    showDetails(); 
}

function showDetails(id) {

  const detailContainer = document.querySelector(".task-detail-container");

    if (!id) {
    detailContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-folder-open"></i>
        <p>Select a task to view details</p>
      </div>
    `;
    return;
  }
  const todo = getTodos().find(t => t.id === id);

  const categories = getCategories()
  const categoryObj = categories.find((cat) => cat.id == todo.category) 


  if (!todo) return;

  


  detailContainer.innerHTML = `
  <div class="todo-detail">
  ${
    todo.image ? `
       <div class="img-card large">
      <img
        class="task-img"
        src="${todo.image}"
        alt="img"
      />
    </div>
      ` : ""
     }

    <div class="todo-progress-detail">
      <h2 class="task-title">${todo.title}</h2>

      <div class="meta">
        <span class="badge priority extreme">${todo.priority}</span>
        <span class="badge status pending">Not Started</span>
      </div>

      <p class="date">
        <i class="fa-regular fa-calendar"></i>
        Created on <span>${todo.dueDate}</span>
      </p>
    </div>
  </div>

  <div class="task-full-detail-section">
    <div class="detail-row">
      <p class="label">Title</p>
      <p class="value">${todo.title}</p>
    </div>

    <div class="detail-row">
      <p class="label">Description</p>
      <p class="value">
        ${todo.desc}
      </p>
    </div>

    <div class="detail-row">
      <p class="label">Category</p>
      <p class="value">${categoryObj ? categoryObj.name : "General"}</p>
    </div>

    <div class="detail-row">
      <p class="label">Due Date</p>
      <p class="value">${todo.dueDate}</p>
    </div>
  </div>

  <div class="task-actions">
    <button class="edit-btn edit"  data-id="${todo.id}">
      <i class="fa-solid fa-pen"></i> 
    </button>
    <button class="delete-btn" data-id="${todo.id}">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
  `;

}

function deleteTodoHandle(id) {

  openConfirmModal("Are you sure you want to delete this task?", () => {
    deleteTodoService(id);

    renderTaskList();
    showDetails(); 

  });
}

listSection.addEventListener("click", (e) => {
  const card = e.target.closest(".todo-card");
  if (!card) return;

  const id = Number(card.dataset.id);
  showDetails(id);
});

rightPanel.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");

  if (!deleteBtn) return;

  const id = Number(deleteBtn.dataset.id);

  deleteTodoHandle(id);
});

rightPanel.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn")
  if(!editBtn) return

  const id = Number(editBtn.dataset.id)

  openEditTask(id, {
  form: document.getElementById("todoForm"),
  modal: document.getElementById("todoModal"),
  modalHeading: document.querySelector(".modal-header h4"),
  submitBtn: document.querySelector('button[type="submit"]')
  });

})

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
  onSuccess: renderTaskList
});


