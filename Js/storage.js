function safeParse(key){
  try {
    const data = JSON.parse(localStorage.getItem(key))
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Invalid JSON found:", error);
    return []
  }
}


function safeParseObject(key, fallback = {}){
  try {
    const data = JSON.parse(localStorage.getItem(key))
    return data && typeof data === "object" && !Array.isArray(data)
      ? {...fallback, ...data} : fallback
  } catch (error) {
    console.error(`Invalid JSON found in ${key}:`, error);
    return fallback;
  }
}


export const getTodos = () => safeParse("todos")
export const getCategories = () => safeParse("categories")
export const getPriorities = () => safeParse("priorities")
export const getFilterState = () => safeParseObject("selectedFilters", defaultFilterState)

export function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function savePriorities(priorities){
  localStorage.setItem("priorities", JSON.stringify(priorities))
}

export function saveCategories(categories){
  localStorage.setItem("categories", JSON.stringify(categories));
}

export function saveFilterState(filters) {
  localStorage.setItem("selectedFilters", JSON.stringify(filters));
}

export function clearFilterState() {
  localStorage.setItem("selectedFilters", JSON.stringify(defaultFilterState));
}


const defaultCategories = [
  {id: 1, name: "Study",isDefault: true },
  {id: 2, name: "Work", isDefault: true },
];

const defaultPriorities = [
  {id : 1, name: "High", color : "#ef4444",isDefault: true},
  {id : 3, name: "Low", color: "#22c55e",isDefault: true},
]

export const defaultFilterState = {
  status: "all",
  dueDate: "all",
  categories: [],
  priorities: []
};

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





