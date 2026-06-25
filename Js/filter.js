import {
  getCategories,
  getPriorities,
  getFilterState,
  saveFilterState,
  defaultFilterState,
  clearFilterState
} from "./storage.js";

const filterModal = document.getElementById("filterPanel");
const taskFilterContainer = document.querySelector(".task-filter");
const categoryList = document.getElementById("filterCategoryList");
const priorityList = document.getElementById("filterPriorityList");

let selectedFilters = getFilterState();

taskFilterContainer.addEventListener("click", (e) => {
  const taskFilterButton = e.target.closest("#filterBtn");
  const taskFilterCancelButton = e.target.closest("#cancelFiltersBtn");

  
  if (taskFilterButton) {
    filterModal.classList.toggle("active");
    return;
  }

  if (taskFilterCancelButton) {
    filterModal.classList.remove("active");
    return;
  }

  const ApplyButton = e.target.closest(".task-filter-primary-btn")
  if(ApplyButton){
    filterModal.classList.remove("active");
    saveFilterState(selectedFilters)
    return
  }

  const clearButton = e.target.closest(".task-filter-clear-btn")
  if (clearButton) {
  selectedFilters = structuredClone(defaultFilterState);
  clearFilterState();
  populateCategoryAndPriorityInFilterOptions();
  return;
}
});

taskFilterContainer.addEventListener("change", (e) => {
  const input = e.target.closest('input[type="checkbox"]');
  if (!input) return;

  const filterOption = input.closest(".task-filter-check");
  if (!filterOption) return;

  const id = Number(filterOption.dataset.id);
  const type = filterOption.dataset.filterType;
  const checked = input.checked;
  
  addPrioritiesAndCategoriesState(id,type,checked)
  
});

function populateCategoryAndPriorityInFilterOptions() {
  categoryList.innerHTML = "";
  priorityList.innerHTML = "";
  
  const categories = getCategories();
  const priorities = getPriorities();

  categories.forEach((category) => {
    const categoryOption = document.createElement("label");
    categoryOption.className = "task-filter-check";
    categoryOption.dataset.id = category.id;
    categoryOption.dataset.filterType = "category";
    const isChecked  = selectedFilters.categories.includes(category.id)


    categoryOption.innerHTML = `
      <input type="checkbox" name="taskCategory " ${isChecked ? "checked " : ""} />
      <span class="task-filter-check-box"></span>
      <span class="task-filter-check-label">${category.name || "N/A"}</span>
    `;

    categoryList.appendChild(categoryOption);
  });

  priorities.forEach((priority) => {
    const isChecked = selectedFilters.priorities.includes(priority.id)
    const priorityOption = document.createElement("label");
    priorityOption.className = "task-filter-check";
    priorityOption.dataset.id = priority.id;
    priorityOption.dataset.filterType = "priority";
    // console.log(isChecked)

    priorityOption.innerHTML = `
      <input type="checkbox" name="taskPriority" ${isChecked ? "checked " : ""} />
      <span class="task-filter-check-box"></span>
      <span class="task-filter-check-label">${priority.name || "N/A"}</span>
      <span class="task-filter-color-dot" style="background:${priority.color || "#6b7280"}"></span>
    `;

    priorityList.appendChild(priorityOption);
  });
}

function addPrioritiesAndCategoriesState(id, type, checked){
  if (type === "category") {
  if (checked) {
    if (!selectedFilters.categories.includes(id)) {
      selectedFilters.categories.push(id);
    }
  } else {
    selectedFilters.categories = selectedFilters.categories.filter(
      item => item !== id
    );
  }
}

  if (type === "priority") {
  if (checked) {
    if (!selectedFilters.priorities.includes(id)) {
      selectedFilters.priorities.push(id);
    }
  } else {
    selectedFilters.priorities = selectedFilters.priorities.filter(
      item => item !== id
    );
  }
}

// saveFilterState(selectedFilters)

}

populateCategoryAndPriorityInFilterOptions();

console.log(selectedFilters)