import { getEditState } from "./taskActions.js";


export function isFormValid(form) {
    if (form.name) {
    return form.name.value.trim() !== "";
  }

  return (
    form.title.value.trim() !== "" &&
    form.priority.value.trim() !== "" 
  );
}

export function isEditChanged(form) {
  const { originalTodoData, originalCatData } = getEditState();

  if (originalTodoData) {
    return (
      form.title.value !== originalTodoData.title ||
      form.desc.value !== originalTodoData.desc ||
      form.priority.value !== originalTodoData.priority ||
      form.category.value !== originalTodoData.category ||
      form.dueDate.value !== originalTodoData.dueDate
    );
  }

  if (originalCatData) {
    return form.name.value !== originalCatData.name;
  }

  return false;
}

export function initForm(form, config) {
  const {
    createFn,
    updateFn,
    getEditState,
    clearEditState,
    onSuccess
  } = config;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const { editTodoId, editCategoryId } = getEditState();

    
   if (editTodoId !== null) {
     updateFn(editTodoId, data);
   } else if (editCategoryId !== null) {
     updateFn(editCategoryId, data);
   } else {
     createFn(data);
   }

    form.reset();
    clearEditState();
    document.getElementById("todoModal").classList.remove("active");

    onSuccess();
  });
}

