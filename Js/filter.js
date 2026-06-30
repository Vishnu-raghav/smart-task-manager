import { rerenderPage } from "./app.js";
import {
  getCategories,
  getPriorities,
  getFilterState,
  saveFilterState,
  clearFilterState,
  getTodos,
} from "./storage.js";

const filterModal = document.getElementById("filterPanel");
const taskFilterContainer = document.querySelector(".task-filter");
const categoryList = document.getElementById("filterCategoryList");
const priorityList = document.getElementById("filterPriorityList");

let selectedFilters = getFilterState();


taskFilterContainer.addEventListener("click", (e) => {
  const taskFilterButton = e.target.closest("#filterBtn");
  const cancelButton = e.target.closest("#cancelFiltersBtn");
  const applyButton = e.target.closest("#applyFiltersBtn");
  const clearButton = e.target.closest("#clearFiltersBtn");

  if (taskFilterButton) {
    selectedFilters = getFilterState();
    syncFilterUI();
    filterModal.classList.toggle("active");
    return
  }

  if (cancelButton) {
    selectedFilters = getFilterState();
    filterModal.classList.remove("active");
    syncFilterUI();
    return;
  }

  if (applyButton) {
    saveFilterState(selectedFilters);
    filterModal.classList.remove("active");
    
    rerenderPage()
    return;
  }

  if (clearButton) {
    clearFilterState();
    selectedFilters = getFilterState();   
    syncFilterUI();
    return;
  }
});

taskFilterContainer.addEventListener("change", (e) => {
  const checkbox  = e.target.closest('input[type="checkbox"]');
  if (checkbox ){
  const filterOption = checkbox.closest(".task-filter-check");
  if (!filterOption) return;
  
  const id = Number(filterOption.dataset.id);
  const type = filterOption.dataset.filterType;
  const checked = checkbox.checked;

  updateMultiSelectFilters(id, type, checked);
  return
  }

  const radio = e.target.closest('input[type="radio"]')
  if(radio){
    const filterOption = radio.closest(".task-filter-chip")
    if(!filterOption) return

    const type = filterOption.dataset.filterType
    const value = radio.value

    updateSingleSelectFilters(type, value)

    return
  }


});

function syncFilterUI() {
  categoryList.innerHTML = "";
  priorityList.innerHTML = "";

  syncRadioButtons();

  const categories = getCategories();
  const priorities = getPriorities();

  categories.forEach((category) => {
    const isChecked = selectedFilters.categories.includes(category.id);

    const categoryOption = document.createElement("label");
    categoryOption.className = "task-filter-check";
    categoryOption.dataset.id = category.id;
    categoryOption.dataset.filterType = "category";

    categoryOption.innerHTML = `
      <input type="checkbox" name="taskCategory" ${isChecked ? "checked" : ""}/>
      <span class="task-filter-check-box"></span>
      <span class="task-filter-check-label">${category.name}</span>
    `;

    categoryList.appendChild(categoryOption);
  });

  priorities.forEach((priority) => {
    const isChecked = selectedFilters.priorities.includes(priority.id);

    const priorityOption = document.createElement("label");
    priorityOption.className = "task-filter-check";
    priorityOption.dataset.id = priority.id;
    priorityOption.dataset.filterType = "priority";

    priorityOption.innerHTML = `
      <input type="checkbox" name="taskPriority" ${isChecked ? "checked" : ""}/>
      <span class="task-filter-check-box"></span>
      <span class="task-filter-check-label">${priority.name}</span>
      <span
        class="task-filter-color-dot"
        style="background:${priority.color}"
      ></span>
    `;

    priorityList.appendChild(priorityOption);
  });
}

function updateMultiSelectFilters(id, type, checked) {
  if (type === "category") {
    if (checked) {
      if (!selectedFilters.categories.includes(id)) {
        selectedFilters.categories.push(id);
      }
    } else {
      selectedFilters.categories = selectedFilters.categories.filter(
        (item) => item !== id
      );
    }
  } else if (type === "priority") {
    if (checked) {
      if (!selectedFilters.priorities.includes(id)) {
        selectedFilters.priorities.push(id);
      }
    } else {
      selectedFilters.priorities = selectedFilters.priorities.filter(
        (item) => item !== id
      );
    }
  }

}


function updateSingleSelectFilters(type, value){
  if(type === "status"){
      selectedFilters.status = value
  }else if(type === "dueDate"){
      selectedFilters.dueDate = value
  }
}

function syncRadioButtons() {

  const statusRadios = document.querySelectorAll(
    'input[name="taskStatus"]'
  );

  statusRadios.forEach((radio) => {
    radio.checked = radio.value === selectedFilters.status;
  });

  const dueDateRadios = document.querySelectorAll(
    'input[name="taskDueDate"]'
  );

  dueDateRadios.forEach((radio) => {
    radio.checked = radio.value === selectedFilters.dueDate;
  });

}

export function filterTodos(todos, selectedFilters) {
    
   
  if (
    selectedFilters.categories.length === 0 &&
    selectedFilters.priorities.length === 0 &&
    selectedFilters.status === "All" && 
    selectedFilters.dueDate === "All"
  ) {
    return todos;
  }

  return todos.filter(todo => {

    const categoryPass =
      selectedFilters.categories.length === 0 ||
      selectedFilters.categories.includes(Number(todo.category));

    const priorityPass =
      selectedFilters.priorities.length === 0 ||
      selectedFilters.priorities.includes(Number(todo.priority));

      let statusPass;

    if (selectedFilters.status === "All") {
       statusPass = true;
    }else if (selectedFilters.status === "active") {
       statusPass = !todo.completed;
    }else if (selectedFilters.status === "completed") {
       statusPass = todo.completed;
    }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      let dueDatePass;

    if (selectedFilters.dueDate === "All") {
      dueDatePass = true;
    } else if (selectedFilters.dueDate === "today") {
      dueDatePass =
        dueDate.getTime() === today.getTime();
    } else if (selectedFilters.dueDate === "week") {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
    
      dueDatePass =
        dueDate >= today &&
        dueDate <= nextWeek;
    } else if (selectedFilters.dueDate === "overdue") {
      dueDatePass =
        dueDate < today &&
        !todo.completed;
    }


    return categoryPass && priorityPass && statusPass && dueDatePass
  });
}

syncFilterUI();




