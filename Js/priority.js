import {createPriority, deletePriority} from "./taskcrud.js"
import { getPriorities, savePriorities } from "./storage.js";

const priorityContainer = document.getElementById("task-priority") 
const dropdown = document.getElementById("priorityDropdown");
const selected = dropdown.querySelector(".dropdown-selected");

let isAddingPriority = false

const colors = [
  { name: "Red", color: "#ef4444" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Yellow", color: "#facc15" },
  { name: "Purple", color: "#a855f7" },
  { name: "Gray", color: "#6b7280" }
];


const colorHTML = colors.map(color => `
  <div
    class="color-option"
    data-color="${color.color}"
  >
    <span
      class="color-box"
      style="background:${color.color}"
    ></span>

    <span>${color.name}</span>
  </div>
`).join("");


selected.addEventListener("click", () => {
  dropdown.classList.toggle("active");
  if (!dropdown.classList.contains("active")) {
     closePriorityModals()

    isAddingPriority = false;
    renderPriorityInputSection();
  }
});

priorityContainer.addEventListener("click", (e) => {

  const saveBtn = e.target.closest(".priority-create");
  if (saveBtn) {
    const success = addNewPriorityHandle()

    if(!success) return

    isAddingPriority = false;
    renderPriorityInputSection();
    return;
  }

  const cancelBtn = e.target.closest(".cancel-priority");
  if (cancelBtn) {
    isAddingPriority = false;
    renderPriorityInputSection();
    return;
  }

  const addBtn = e.target.closest(".add-priority-btn");
  if (addBtn) {
    isAddingPriority = true;
    renderPriorityInputSection();
    return;
  }

  const deleteBtn = e.target.closest(".priority-delete-btn")
  if(deleteBtn){
     const item = deleteBtn.closest(".dropdown-item")
     if(!item) return

     const id = Number(item.dataset.id)
     deletePriorityHandle(id)
     return
  }

  const dots = e.target.closest(".dots")
  if(dots){
    const container = dots.closest(".dropdown-item")
    if(!container) return

    const modal = container.querySelector(".priority-dropdown-modal")    
    const allActiveModal = document.querySelectorAll(".priority-dropdown-modal.active");
    const isOpen = modal.classList.contains("active");

    allActiveModal.forEach(modal => {
      modal.classList.remove("active")
    });
    
    if(isOpen){
      return;
    }
    
    modal.classList.add("active");

    return
  }

  const colorOption = e.target.closest(".color-option");
  if(colorOption){
   const color = colorOption.dataset.color
   const item = colorOption.closest(".dropdown-item") 
   if(!item) return

   const id = Number(item.dataset.id)
   priorityColor(id, color)
   return;
  }

  const item = e.target.closest(".dropdown-item");
  if (!item) return;

  const id = item.dataset.id;
  const priority = getPriorities().find(
  p => p.id === Number(id)
  );

  renderSelectedPriority(priority)
  
  dropdown.dataset.value = id;
  dropdown.classList.remove("active");

  closePriorityModals()

});


function populateCustomDropdown(){

    priorityContainer.innerHTML = ""
    
    const data = getPriorities()

    data.forEach(item => {
        const div = document.createElement("div")
        div.classList.add("dropdown-item")
        div.dataset.id = item.id

        div.innerHTML = `
        <span
        class="priority-badge"
        style="
        background:${item.color};
        color:white;
        "
        >
          ${item.name}
        </span>
          <button
           type="button"
           class="dots"
          >
            <i class="fa-solid fa-ellipsis"></i>
          </button>
          <div class="priority-dropdown-modal">
           ${
            !item.isDefault ? `
            <button
              type="button"
              class="priority-delete-btn"
            >
              Delete
            </button>
            <div class="priority-divider"></div>
            ` : ``
          }

       <div class="priority-colors">
         ${colorHTML}
       </div>

        </div>
        `;

        priorityContainer.appendChild(div)
    })

     const addBtn = document.createElement("div");

     addBtn.classList.add("add-new");
     
     addBtn.innerHTML = `
       <button type="button" class="add-priority-btn">
         + Add Priority
       </button>
     `;

     priorityContainer.appendChild(addBtn);
}

function resetPriorityDropdown() {
  selected.innerText = "Select Priority";
  dropdown.dataset.value = "";
}

function renderPriorityInputSection() {

  const addNewContainer = document.querySelector(".add-new");

  if (isAddingPriority) {

    addNewContainer.innerHTML = `
  <input
    class="priority-input"
    type="text"
    placeholder="Enter priority name"
  >

  <p class="priority-error">
    Priority already exists
  </p>

  <div class="priority-actions">
    <button
      type="button"
      class="priority-create"
    >
      Save
    </button>

    <button
      type="button"
      class="cancel-priority"
    >
      Cancel
    </button>
  </div>
`;

  const input = addNewContainer.querySelector(".priority-input");
  const error = addNewContainer.querySelector(".priority-error");

  input.addEventListener("input", () => {
    error.style.display = "none";
  });

  } else {

    addNewContainer.innerHTML = `
      <button
        type="button"
        class="add-priority-btn"
      >
        + Add Priority
      </button>
    `;

  }
}

function addNewPriorityHandle(){

  const container = document.querySelector(".add-new");

  const input = container.querySelector(".priority-input");
  const value = input.value.trim();

  if(!value) return false;

  const createdPriority = createPriority({
    name: value
  });

  if(createdPriority?.error){
  const show = container.querySelector(".priority-error");

  show.style.display = "block";

  setTimeout(() => {
    show.style.display = "none";
  }, 3000);

  return false;
}

  populateCustomDropdown();

  renderSelectedPriority(createdPriority);

  dropdown.dataset.value = createdPriority.id;

  dropdown.classList.remove("active");

  return true;
}

function deletePriorityHandle(id){

  if (Number.isNaN(id)) return;

  deletePriority(id)
  const selectedId = Number(dropdown.dataset.value);

  if(selectedId === id){
     resetPriorityDropdown();
  }

  populateCustomDropdown()
}

function closePriorityModals() {
  document
    .querySelectorAll(".priority-dropdown-modal.active")
    .forEach(modal => {
      modal.classList.remove("active");
    });
}

function priorityColor(id, color) {
  if (Number.isNaN(id) || !color) return;

  const priorities = getPriorities();
  const priority = priorities.find(p => p.id === id);

  if (!priority) return;

  priority.color = color;
  savePriorities(priorities);

  populateCustomDropdown();

  const selectedId = Number(dropdown.dataset.value);

  if (selectedId === id) {
    renderSelectedPriority(priority);
  }
}

function renderSelectedPriority(priority){
  if(!priority) return;

  selected.innerHTML = `
    <span
      class="priority-badge"
      style="
        background:${priority.color || "#6b7280"};
        color:white;
      "
    >
      ${priority.name}
    </span>
  `;
}

resetPriorityDropdown()
populateCustomDropdown()
