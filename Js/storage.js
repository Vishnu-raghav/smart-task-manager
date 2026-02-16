export function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function getTodos() {
  const data = JSON.parse(localStorage.getItem("todos"));
  return Array.isArray(data) ? data : [];
}


const defaultCategories = [
  { name: "Study",isDefault: true },
  { name: "Work", isDefault: true },
  { name: "Personal", isDefault: true },
  { name: "Urgent", isDefault: true }
];

export function initializeCategories() {
  const stored = localStorage.getItem("categories");

  if (!stored) {
    localStorage.setItem("categories", JSON.stringify(defaultCategories));
  }
}

export function getCategories(){
  const data = JSON.parse(localStorage.getItem("categories"));
  return Array.isArray(data) ? data : [];
}

export function saveCategories(categoryName){
  localStorage.setItem("categories",JSON.stringify(categoryName));
}