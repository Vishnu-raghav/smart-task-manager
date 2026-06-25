import { getCategories, getPriorities } from "./storage.js";

const filterModal = document.getElementById("filterPanel");
const taskFilterContainer = document.querySelector(".task-filter");
const categoryList = document.getElementById("filterCategoryList");
const priorityList = document.getElementById("filterPriorityList");

  const selectedFilters = {
    categories: [],
    priorities: []
  }


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
});

taskFilterContainer.addEventListener("change", (e) => {
  const input = e.target.closest('input[type="checkbox"]');
  if (!input) return;

  const filterOption = input.closest(".task-filter-check");
  if (!filterOption) return;

  const id = Number(filterOption.dataset.id);
  const type = filterOption.dataset.filterType;
  const checked = input.checked;
  console.log(type,id,checked)
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

    categoryOption.innerHTML = `
      <input type="checkbox" name="taskCategory" />
      <span class="task-filter-check-box"></span>
      <span class="task-filter-check-label">${category.name || "N/A"}</span>
    `;

    categoryList.appendChild(categoryOption);
  });

  priorities.forEach((priority) => {
    const priorityOption = document.createElement("label");
    priorityOption.className = "task-filter-check";
    priorityOption.dataset.id = priority.id;
    priorityOption.dataset.filterType = "priority";

    priorityOption.innerHTML = `
      <input type="checkbox" name="taskPriority" />
      <span class="task-filter-check-box"></span>
      <span class="task-filter-check-label">${priority.name || "N/A"}</span>
      <span class="task-filter-color-dot" style="background:${priority.color || "#6b7280"}"></span>
    `;

    priorityList.appendChild(priorityOption);
  });
}


function addPrioritiesAndCategoriesState(id, type, checked){


  if(type === "category" && checked){
    selectedFilters.categories.push(id)
  }else{
    selectedFilters.categories = selectedFilters.categories.filter(
      (item) => item !== id
    )
  }

   if (type === "priority") {
    if (checked) {
      selectedFilters.priorities.push(id);
    } else {
      selectedFilters.priorities = selectedFilters.priorities.filter(
        (item) => item !== id
      );
    }
  }


  console.log(selectedFilters)

}

populateCategoryAndPriorityInFilterOptions();