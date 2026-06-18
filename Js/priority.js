import {createPriority, deletePriority} from "./taskcrud.js"
import { getPriorities, savePriorities } from "./storage.js";

const priorityContainer = document.getElementById("task-priority") 
const dropdown = document.getElementById("priorityDropdown");
const selected = dropdown.querySelector(".dropdown-selected");

let isAddingPriority = false

selected.addEventListener("click", (e) => {
  dropdown.classList.toggle("active");
  if (!dropdown.classList.contains("active")) {
     closePriorityModals()
  }
});

priorityContainer.addEventListener("click", (e) => {

  const saveBtn = e.target.closest(".priority-create");
  if (saveBtn) {
    const success = addNewPriorityHandle()

    if(!success) return

    isAddingPriority = false;
    renderAddPriority();
    return;
  }

  const cancelBtn = e.target.closest(".cancel-priority");
  if (cancelBtn) {
    isAddingPriority = false;
    renderAddPriority();
    return;
  }

  const addBtn = e.target.closest(".add-priority-btn");
  if (addBtn) {
    isAddingPriority = true;
    renderAddPriority();
    return;
  }

  const deleteBtn = e.target.closest(".priority-delete-btn")
  if(deleteBtn){
    deletePriorityHandle(deleteBtn)
    return
  }

  const dots = e.target.closest(".dots")
  if(dots){
    const container = dots.closest(".dropdown-item")
    const modal = container.querySelector(".priority-dropdown-modal")
    const allActiveModal = document.querySelectorAll(".priority-dropdown-modal.active");
    const isOpen = modal.classList.contains("active");

    allActiveModal.forEach(modal => {
      modal.classList.remove("active");
    });
    
    if(isOpen){
      return;
    }
    
    modal.classList.add("active");

    return
  }

  const colorOption = e.target.closest(".color-option");
  if(colorOption){
   priorityColor(colorOption)
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


export function populateCustomDropdown(selectedElement,container, data){
    selectedElement.innerHTML = ""

    container.innerHTML = ""

    selected.textContent = "Select Priority";
    
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
           ${!item.isDefault ? `
            <button
              type="button"
              class="priority-delete-btn"
            >
              Delete
            </button>
            <div class="priority-divider"></div>
            ` : 
            ``}
            

<div class="priority-colors">

  <div class="color-option" data-color="#ef4444">
    <span class="color-box red"></span>
    <span>Red</span>
  </div>

  <div class="color-option" data-color="#22c55e">
    <span class="color-box green"></span>
    <span>Green</span>
  </div>

  <div class="color-option" data-color="#3b82f6">
    <span class="color-box blue"></span>
    <span>Blue</span>
  </div>

  <div class="color-option" data-color="#facc15">
    <span class="color-box yellow"></span>
    <span>Yellow</span>
  </div>
  <div class="color-option" data-color="#a855f7">
    <span class="color-box purple"></span>
    <span>purple</span>
  </div>
  <div class="color-option" data-color="#6b7280">
    <span class="color-box Gray"></span>
    <span>Gray</span>
  </div>

</div>

        </div>
        `;

        container.appendChild(div)
    })

     const addBtn = document.createElement("div");

     addBtn.classList.add("add-new");
     
     addBtn.innerHTML = `
       <button type="button" class="add-priority-btn">
         + Add Priority
       </button>
     `;

     container.appendChild(addBtn);
}

export function resetPriorityDropdown() {
  selected.innerText = "Select Priority";
  dropdown.dataset.value = "";
}

function renderAddPriority() {

  const addNewContainer =
    document.querySelector(".add-new");

  if (isAddingPriority) {

    addNewContainer.innerHTML = `
      <input
        class="priority-input"
        type="text"
        placeholder="Priority name"
      >

      <div class="priority-actions">
        <span class="priority-create">Save</span>
        <p class="priority-error">Priority already exist</p>
        <span class="cancel-priority">Cancel</span>
      </div>
    `;

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

  if(!input) return;

  const value = input.value.trim();

  if(!value) return;

  const createdPriority = createPriority({
    name: value
  });

  if(createdPriority?.error){
    const show = container.querySelector(".priority-error");
    show.style.display = "block";
    return false;
  }

  populateCustomDropdown(
    selected,
    priorityContainer,
    getPriorities()
  );

  renderSelectedPriority(createdPriority);

  dropdown.dataset.value = createdPriority.id;

  dropdown.classList.remove("active");

  return true;
}

function deletePriorityHandle(deleteBtn){
  const item = deleteBtn.closest(".dropdown-item")
  const id = Number(item.dataset.id)

  deletePriority(id)
  populateCustomDropdown(
   selected,
   priorityContainer,
   getPriorities()
)
}

function closePriorityModals() {
  document
    .querySelectorAll(".priority-dropdown-modal.active")
    .forEach(modal => {
      modal.classList.remove("active");
    });
}

function priorityColor(coloroptions){

  const color = coloroptions.dataset.color
  const item = coloroptions.closest(".dropdown-item")  
  const id = Number(item.dataset.id)

  const priorities = getPriorities()

  const priority = priorities.find(p => p.id === id)

  if(!priority) return

  priority.color = color

  savePriorities(priorities)

  populateCustomDropdown(
   selected,
   priorityContainer,
   getPriorities()
  )

  const selectedId = Number(dropdown.dataset.value);

  if (selectedId === id) {
   renderSelectedPriority(priority)
  }
}


function renderSelectedPriority(priority){
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