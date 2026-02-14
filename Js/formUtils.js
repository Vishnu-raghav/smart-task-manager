import { clearEditState,getEditState } from "./taskActions.js";
import {
  createTodo as createTodoService,
  updateTodo as updateTodoService,
} from "./taskcrud.js";

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

export function initForm(form, onSuccess) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const { editTodoId } = getEditState();

    if (editTodoId !== null) {
      updateTodoService(editTodoId, data);
    } else {
      createTodoService(data);
    }

    form.reset();
    clearEditState();
    document.getElementById("todoModal").classList.remove("active");

    onSuccess(); 
  });
}





