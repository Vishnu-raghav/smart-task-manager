import { initializeCategories,getCategories, getTodos } from "./storage.js";
import { createCategory, deleteCategory } from "./taskcrud.js";

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

    const tasks = todos.filter(t => t.category === cat.name);
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const lastTask = tasks.length
      ? tasks[tasks.length - 1].dueDate || "N/A"
      : "No tasks";

    const card = document.createElement("div");
    card.className = "category-card";
    card.dataset.name = cat.name;
    card.style.background = `linear-gradient(135deg, ${cat.color} #333)`;

    card.innerHTML = `

      <div class="category-header">
          <h3>${cat.name}</h3>
          <input type="checkbox">
      </div>

      <h3>${cat.name}</h3>
      <p>${total} Tasks</p>
      <p>${completed} Completed</p>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>

      <p style="font-size:11px;margin-top:8px;">
        Last task: ${lastTask}
      </p>
    `;
    categorySection.appendChild(card);
  });
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
   const formData = new FormData(form);
   const data = Object.fromEntries(formData.entries());

   createCategory(data)
   
   form.reset();
   todoModal.classList.remove("active")
   
  })

function showCategoryTasks(categoryName) {
  const todos = getTodos();
  const filtered = todos.filter(t => t.category === categoryName);

  if (!filtered.length) {
    rightPanel.innerHTML = `
      <p style="color:#777;">No tasks in ${categoryName}</p>
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

  const categoryName = card.dataset.name;
  showCategoryTasks(categoryName);
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


