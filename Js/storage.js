export function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function getTodos() {
  const data = JSON.parse(localStorage.getItem("todos"));
  return Array.isArray(data) ? data : [];
}