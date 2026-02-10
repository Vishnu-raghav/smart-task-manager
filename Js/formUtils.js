import { getEditState } from "./taskActions.js";
import { createTodo, updateTodo } from "./dashboard.js";

export function isFormValid(form) {
  return (
    form.title.value.trim() !== "" &&
    form.priority.value.trim() !== ""
  );
}

export function isEditChanged(form) {
  const { originalTodoData } = getEditState();
  if (!originalTodoData) return false;

  return (
    form.title.value !== originalTodoData.title ||
    form.desc.value !== originalTodoData.desc ||
    form.priority.value !== originalTodoData.priority ||
    form.category.value !== originalTodoData.category ||
    form.dueDate.value !== originalTodoData.dueDate
  );
}

export function attachFormSubmit(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const { editTodoId } = getEditState();

    if (editTodoId === null) {
      createTodo();
    } else {
      updateTodo();
    }
  });
}


