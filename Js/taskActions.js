import { getTodos, getCategories } from "./storage.js";

let editTodoId = null;
let originalTodoData = null;
let editCategoryId = null;
let originalCatData = null

export function openEditTask(id, {
  form,
  modal,
  modalHeading,
  submitBtn
}) {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  editTodoId = id;

  form.title.value = todo.title;
  form.desc.value = todo.description;
  form.priority.value = todo.priority;
  form.category.value = todo.category;
  form.dueDate.value = todo.dueDate;

  originalTodoData = {
    title: todo.title,
    desc: todo.description,
    priority: todo.priority,
    category: todo.category,
    dueDate: todo.dueDate
  };

  modalHeading.innerText = "Edit Task";
  submitBtn.innerText = "Update Task";
  submitBtn.disabled = true;

  modal.classList.add("active");
}

export function openEditCategory(id, {
  form,
  modal,
  modalHeading,
  submitBtn
}) {
  const categories = getCategories();
  const category = categories.find(c => c.id == id);
  if (!category) return;

  editCategoryId = id;

  form.name.value = category.name;

  originalCatData = {
    name : category.name
  }

  modalHeading.innerText = "Edit Category";
  submitBtn.innerText = "Update Category";
  submitBtn.disabled = false;

  modal.classList.add("active");
}

export function getEditState() {
  return { editTodoId, originalTodoData, editCategoryId, originalCatData  };
}

export function clearEditState() {
  editTodoId = null;
  originalTodoData = null;
  editCategoryId = null
  originalCatData = null
}



