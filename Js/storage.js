export function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function getTodos() {
  const data = JSON.parse(localStorage.getItem("todos"));
  return Array.isArray(data) ? data : [];
}

export function getCategories(){
  const data = JSON.parse(localStorage.getItem("category"));
  return Array.isArray(data) ? data : [];
}

export function saveCategories(categoryName){
  localStorage.setItem("category",JSON.stringify(categoryName));
}