function safeParse(key){
  try {
    const data = JSON.parse(localStorage.getItem(key))
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Invalid JSON found:", error);
    return []
  }
}

export const getTodos = () => safeParse("todos")
export const getCategories = () => safeParse("categories")
export const getPriorities = () => safeParse("priorities")

export function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function savePriorities(priorities){
  localStorage.setItem("priorities", JSON.stringify(priorities))
}

export function saveCategories(categories){
  localStorage.setItem("categories", JSON.stringify(categories));
}

const defaultCategories = [
  {id: 1, name: "Study",isDefault: true },
  {id: 2 ,name: "Work", isDefault: true },
];

const defaultPriorities = [
  {id : 1, name: "High", isDefault: true},
  {id : 2, name: "Medium", isDefault: true},
  {id : 3, name: "Low", isDefault: true},
]

export function initializeCategories() {
  const stored = getCategories()

  if (stored.length === 0) {
    saveCategories(defaultCategories)
  }
}

export function initializePriorities() {
  const stored = getPriorities()

  if (stored.length === 0) {
    savePriorities(defaultPriorities)
  }
}




