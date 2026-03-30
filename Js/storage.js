export function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function getTodos() {
  const data = JSON.parse(localStorage.getItem("todos"));
  return Array.isArray(data) ? data : [];
}


const defaultCategories = [
  {id: Date.now() + 1 ,name: "Study",isDefault: true },
  {id: Date.now() + 2 ,name: "Work", isDefault: true },
];

const defaultPriorites = [
  {id : Date.now() + 1, name: "High", isDefault: true},
  {id : Date.now() + 1, name: "Medium", isDefault: true},
  {id : Date.now() + 1, name: "Low", isDefault: true},
]

export function initializeCategories() {
  const stored = localStorage.getItem("categories");

  if (!stored) {
    localStorage.setItem("categories", JSON.stringify(defaultCategories));
  }
}

export function initializePriorites(){
  const stored = localStorage.getItem("priorites");

  if(!stored){
    localStorage.setItem("priorites", JSON.stringify())
  }
}

export function getCategories(){
  const data = JSON.parse(localStorage.getItem("categories"));
  return Array.isArray(data) ? data : [];
}

export function saveCategories(categoryName){
  localStorage.setItem("categories",JSON.stringify(categoryName));
}