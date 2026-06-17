import {createPriority, deletePriority} from "./taskcrud.js"
import { getPriorities } from "./storage.js";

const priorityContainer = document.getElementById("task-priority") 
const dropdown = document.getElementById("priorityDropdown");
const selected = dropdown.querySelector(".dropdown-selected");

let isAddingPriority = false
selected.addEventListener("click", () => {
  dropdown.classList.toggle("active");
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

  const deleteBtn = e.target.closest(".priority-delete")
  if(deleteBtn){
    deletePriority()
    return
  }


  const item = e.target.closest(".dropdown-item");
  if (!item) return;

  const name = item.querySelector("span").innerText;
  const id = item.dataset.id;

  selected.innerText = name;
  dropdown.dataset.value = id;

  dropdown.classList.remove("active");
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
          <span>${item.name}</span>
          <span class="dots">•••</span>
          <div class="priority-dropdown-modal">

            <button
              type="button"
              class="priority-delete-btn"
            >
              Delete
            </button>
        
            <div class="priority-colors">
        
              <span class="color-dot red">red</span>
              <span class="color-dot green">green</span>
              <span class="color-dot blue">blue</span>
   
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

  if(!input) return

  const value = input.value.trim();

  if(!value) return;

  const createdPriority = createPriority({
  name: value
  });

  if(createdPriority?.error){
    const show = container.querySelector(".priority-error")
    show.style.display = "block";
    console.log(show);
    return false
  }

  populateCustomDropdown(
   selected,
   priorityContainer,
   getPriorities()
)

selected.innerText = createdPriority.name;
dropdown.dataset.value = createdPriority.id;

dropdown.classList.remove("active")
return true
}