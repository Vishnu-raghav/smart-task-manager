const priorityContainer = document.getElementById("task-priority") 
const dropdown = document.getElementById("priorityDropdown");
const selected = dropdown.querySelector(".dropdown-selected");

selected.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});

priorityContainer.addEventListener("click", (e) => {
  const item = e.target.closest(".dropdown-item");
  if(!item) return

  const name = item.querySelector("span").innerText;
  const id = item.dataset.id;

  selected.innerText = name;
  dropdown.dataset.value = id;

  dropdown.classList.remove("active")

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
        `;

        container.appendChild(div)
    })

     const addBtn = document.createElement("div");
     addBtn.classList.add("dropdown-item", "add-new");
     addBtn.innerHTML = `<span>+ Add Priority</span>`;
     container.appendChild(addBtn);

}

export function resetPriorityDropdown() {
  selected.innerText = "Select Priority";
  dropdown.dataset.value = "";
}