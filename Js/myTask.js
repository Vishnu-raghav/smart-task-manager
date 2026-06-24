import { getCategories, getTodos , getPriorities} from "./storage.js";
import { clearEditState, getEditState ,openEditTask } from "./taskActions.js";
import {initForm,updateSubmitButtonState} from "./formUtils.js"
import {openConfirmModal} from "./actionsConfirm.js"

import {
  deleteTodo as deleteTodoService,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
} from "./taskcrud.js";

import {populateOptions as populateCategoryOptions} from "../utils/populateOptions.js"

const rightPanel = document.querySelector(".grid-right-area");
const listSection = document.querySelector(".task-card-section");
const form = document.getElementById("todoForm");
const addTaskBtn = document.querySelector(".Add-Task");
const todoModal = document.getElementById("todoModal");
const modalHeading = todoModal.querySelector(".modal-header h4");
const modalSubmitBtn = todoModal.querySelector('button[type="submit"]');
const select = document.getElementById("task-category");

let activeTaskId = null;

if (select) {
  populateCategoryOptions(select, getCategories(), {
    placeholderText: "Select Category"
  });
}



export function renderTaskList() {
  const todos = getTodos();
  const category = getCategories()
  const priority = getPriorities()
  
  listSection.innerHTML = "";

  if (todos.length === 0) {
    listSection.innerHTML = `
      <div class="empty-state">
        <p>No tasks Click "Add Task" to get started</p>
      </div>
    `;
      activeTaskId = null
      showDetails()
      return
    }

  todos.forEach(task => {
    const categoryObj = category.find((cat) => cat.id === Number(task.category))
    const priorityObj = priority.find((p) => p.id === Number(task.priority)) 
    const statusText = task.completed ? "Completed" : "In progress";
    const statusClass = task.completed ? "completed" : "pending";
    
    const div = document.createElement("div");
    div.className = "task-list-item";
    div.dataset.id = task.id;
    div.innerHTML = `


     <div class="task-list-header">
  
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
 <div class="task-meta">

  <span class="meta-item">
    Category:
    <b>${categoryObj ? categoryObj.name : "General"}</b>
  </span>

  <span class="meta-item">
    Priority:
    <span
      class="priority-pill"
      style="
        background:${priorityObj?.color || '#6b7280'};
        color:white;
      "
    >
      ${priorityObj?.name || "N/A"}
    </span>
  </span>

  <span class="meta-item">
    Status:
    <span class="badge status ${statusClass}">${statusText}</span>
  </span>

  <span class="meta-item">
    Due:
    <b>${task.dueDate || "N/A"}</b>
  </span>

</div>
</div>
    `
    listSection.appendChild(div);
  });

  if (activeTaskId !== null) {
    showDetails(activeTaskId);
  } else {
    showDetails();
  }
}

function showDetails(id) {

  const detailContainer = document.querySelector(".task-detail-container")
  if (!detailContainer) return;

  const todo = getTodos().find(t => t.id === id)
  const priority = getPriorities()

  if(!todo){
   detailContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-folder-open"></i>
        <p>Select a task to view details</p>
      </div>
    `

    return
}

  const categories = getCategories()
  const categoryObj = categories.find((cat) => cat.id == todo.category) 
  const statusText = todo.completed ? "Completed" : "In progress";
  const statusClass = todo.completed ? "completed" : "pending";

  const priorityObj = priority.find((p) => p.id === Number(todo.priority)) 

  console.log(priorityObj?.name)


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
        <span
  class="priority-pill"
  style="
    background:${priorityObj?.color || "#6b7280"};
    color:white;
  "
>
  ${priorityObj?.name || "N/A"}
</span>
        <span class="badge status ${statusClass}">${statusText}</span>
      </div>

      <p class="date">
        <i class="fa-regular fa-calendar"></i>
        Due on <span>${todo.dueDate || "N/A"}</span>
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
      <p class="value">${todo.dueDate || "N/A"}</p>
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

  if(Number.isNaN(id)) return

   openConfirmModal("Are you sure you want to delete this task?", () => {
   deleteTodoService(id)

    if (activeTaskId === id) {
      activeTaskId = null
    }

    renderTaskList()
    
  });
}

function editTodoHandle(id){

  if(Number.isNaN(id)) return

  openEditTask(id, {
  form,
  modal: todoModal,
  modalHeading,
  submitBtn: modalSubmitBtn
  });
}

listSection.addEventListener("click", (e) => {
  const card = e.target.closest(".task-list-item");
  if (!card) return;

  const id = Number(card.dataset.id);
  activeTaskId = id;
  showDetails(id);
});

rightPanel.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  
  if(deleteBtn){
    const id = Number(deleteBtn.dataset.id)
    deleteTodoHandle(id);
    return
  }

  const editBtn = e.target.closest(".edit-btn")
   if(editBtn){
    const id = Number(editBtn.dataset.id)
    editTodoHandle(id)
    return
  }

});


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


form.addEventListener("input",() => {
  updateSubmitButtonState(form,modalSubmitBtn)
})


