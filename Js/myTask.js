import { getCategories, getTodos , saveTodos} from "./storage.js";
import {   clearEditState, getEditState ,openEditTask } from "./taskActions.js";
import {initForm} from "./formUtils.js"
import {openConfirmModal} from "./actionsConfirm.js"

import {
  deleteTodo as deleteTodoService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
} from "./taskcrud.js";

const rightPanel = document.querySelector(".grid-right-area")
const listSection = document.querySelector(".task-card-section")
const form = document.getElementById("todoForm");

export function renderTaskList() {
  const todos = getTodos();
  const category = getCategories()
  listSection.innerHTML = "";

  todos.forEach(task => {
    const categoryObj = category.find((cat) => cat.id == task.category)

    const div = document.createElement("div");
    div.className = "todo-card";
    div.dataset.id = task.id;
    div.innerHTML = `
<div 
  style="
    display:flex;
    gap:14px;
    padding:16px;
    border-radius:14px;
    background:#f6f7fb;
    cursor:pointer;
    transition:all .25s ease;
    box-shadow:0 2px 6px rgba(0,0,0,.06);
    flex-wrap:wrap;
  "

>
  
  <!-- LEFT TEXT -->
  <div style="flex:1;min-width:180px;">
    <span 
      style="
        display:block;
        font-size:16px;
        font-weight:600;
        color:#222;
        margin-bottom:6px;
      "
    >
      ${task.title || "No title"}
    </span>

    <p 
      style="
        font-size:14px;
        color:#666;
        line-height:1.4;
        margin:0;
      "
    >
      ${task.description || "No description"}
    </p>
  </div>

  ${
    task.image
      ? `
        <div 
          style="
            width:90px;
            height:90px;
            border-radius:12px;
            overflow:hidden;
            flex-shrink:0;
          "
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
  style="
    display:flex;
    flex-wrap:wrap;
    gap:10px 16px;
    margin-top:10px;
    padding-left:4px;
    font-size:12.5px;
    color:#555;
  "
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
}

function showDetails(id) {
  const todo = getTodos().find(t => t.id === id);

  const categories = getCategories()
  const categoryObj = categories.find((cat) => cat.id == todo.category) 


  if (!todo) return;
  rightPanel.innerHTML = `
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
        ${todo.description}
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

    rightPanel.innerHTML = `
      <p style="color:#777;text-align:center;margin-top:40px;">
        Task deleted successfully
      </p>
    `;

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

initForm(form, {
  createFn: createTodoService,
  updateFn: updateTodoService,
  getEditState,
  clearEditState,
  onSuccess: renderTaskList
});


