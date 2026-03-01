import { initializeCategories,getCategories, getTodos } from "./storage.js";
import { createCategory, deleteCategory,updateCategory } from "./taskcrud.js";
import {openConfirmModal} from "./actionsConfirm.js"
import { openEditCategory, getEditState, clearEditState } from "./taskActions.js";
import { initForm } from "./formUtils.js";

const categorySection = document.getElementById("categoryCardSection");
const rightPanel = document.querySelector(".grid-right-area");
const createCategoryButton = document.getElementById("add-category-button")
const form = document.getElementById("todoForm");

const todoModal = document.getElementById("todoModal");
const modalHeading = todoModal.querySelector(".modal-header h4");
const modalSubmitBtn = todoModal.querySelector('button[type="submit"]');
const closeBtn = document.querySelector(".close-modal");
initializeCategories()


export function renderCategories() {
  const todos = getTodos();
  const category = getCategories()

  categorySection.innerHTML = "";


  category.forEach(cat => {
     if (!cat || cat.id == null) return; 

    const tasks = todos.filter(t => t.category == cat.id);
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const lastTask = tasks.length
      ? tasks[tasks.length - 1].dueDate || "N/A"
      : "No tasks";

    const card = document.createElement("div");
    card.className = "category-card";
    card.dataset.id = cat.id;
    card.style.background = `linear-gradient(135deg, ${cat.color} #333)`;

    card.innerHTML = `
   ${!cat.isDefault 
  ? `<div class="category-header">
       <h3>${cat.name}</h3>
       <input type="checkbox">
     </div>` 
  : `<div class="category-header">
       <h3>${cat.name}</h3>
     </div>`
}

      <p>${total} Tasks</p>
      <p>${completed} Completed</p>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>

      <p style="font-size:11px;margin-top:8px;">
        Last task: ${lastTask}
      </p>

    ${!cat.isDefault ? `
<div class="categories-actions">
  <button class="edit-btn edit" data-id="${cat.id}">
    <i class="fa-solid fa-pen"></i> 
  </button>
  <button class="delete-btn" data-id="${cat.id}">
    <i class="fa-solid fa-trash"></i>
  </button>
</div>
` : ""}
    `;
    const checkbox = card.querySelector("input");
    const actions = card.querySelector(".categories-actions");

   if (checkbox) {   
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      actions.classList.add("show");
    } else {
      actions.classList.remove("show");
    }
  });
}
 
    categorySection.appendChild(card);

  });
}


function showCategoryTasks(categoryID) {
  const todos = getTodos();
  const filtered = todos.filter(t => t.category  == categoryID);
  const categories = getCategories()
  const categoryObj = categories.find(c => c.id == categoryID);
  const categoryName = categoryObj ? categoryObj.name : "Unknown";

  if (!filtered.length) {
    rightPanel.innerHTML = `
      <p style="color:#777;">No tasks in ${categoryName} </p>
    `;
    return;
  }

  rightPanel.innerHTML = `<h3>${categoryName} Tasks</h3>`;

  filtered.forEach(task => {
    const div = document.createElement("div");
    div.style.marginBottom = "12px";
    div.style.padding = "12px";
    div.style.borderRadius = "10px";
    div.style.background = "#f6f7fb";

    div.innerHTML = `
      <strong>${task.title}</strong>
      <p style="margin:4px 0;color:#666;">
        ${task.description || "No description"}
      </p>
      <small>Priority: ${task.priority}</small>
    `;

    rightPanel.appendChild(div);
  });
}


categorySection.addEventListener("click", (e) => {
  const card = e.target.closest(".category-card");
  if (!card) return;

  const categoryID = card.dataset.id;
  showCategoryTasks(categoryID);
});



categorySection.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return;

  e.stopPropagation();

  const id = Number(deleteBtn.dataset.id);  

  
  openConfirmModal("Delete this category?", () => {
    deleteCategory(id);
    renderCategories();
    rightPanel.innerHTML = "";
  });
});

categorySection.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;

  e.stopPropagation(); 

  const id = Number(editBtn.dataset.id);

  openEditCategory(id, {
  form: document.getElementById("todoForm"),
  modal: document.getElementById("todoModal"),
  modalHeading: document.querySelector(".modal-header h4"),
  submitBtn: document.querySelector('button[type="submit"]')
  });
  
});

createCategoryButton.addEventListener("click", () => {
    form.reset();
    modalSubmitBtn.disabled = true
    
    modalHeading.innerText = "Create Category";
    modalSubmitBtn.innerText = "Create";
    todoModal.classList.add("active");
})


closeBtn.addEventListener("click", () => {
    todoModal.classList.remove("active");
})

form.name.addEventListener("input", () => {
    if(form.name.value.trim() !== ""){
        modalSubmitBtn.disabled = false;
    } else {
        modalSubmitBtn.disabled = true;
    }
});

initForm(form, {
  createFn: createCategory,
  updateFn: updateCategory,
  getEditState,
  clearEditState,
  onSuccess: renderCategories
});

