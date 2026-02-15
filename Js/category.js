import { getTodos } from "./storage.js";
console.log("Categroy loaded")
const categorySection = document.getElementById("categoryCardSection");
const rightPanel = document.querySelector(".grid-right-area");

const defaultCategories = [
  { name: "Study"},
  { name: "Work" },
  { name: "Personal"},
  { name: "Urgent"}
];

export function renderCategories() {
  const todos = getTodos();
  categorySection.innerHTML = "";

  defaultCategories.forEach(cat => {

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
