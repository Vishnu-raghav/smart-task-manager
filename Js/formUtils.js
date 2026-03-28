import { getEditState } from "./taskActions.js";
import {getImage, clearImage} from "../utils/imageState.js"


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
      form.title.value.trim() !== originalTodoData.title.trim() ||
      form.desc.value.trim() !== originalTodoData.desc.trim() ||
      form.priority.value.trim() !== originalTodoData.priority.trim() ||
      form.category.value.trim() !== originalTodoData.category.trim() ||
      form.dueDate.value.trim() !== originalTodoData.dueDate.trim()
    );
  }

  if (originalCatData) {
    return form.name.value.trim() !== originalCatData.name.trim();;
  }

  return false;
}

export function initForm(form, config = {}) {
  const {
    createFn,
    updateFn,
    getEditState,
    clearEditState,
    onSuccess
  } = config;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

   const formData = Object.fromEntries(new FormData(form).entries());
    const { editTodoId, editCategoryId } = getEditState();

    const data = {
      ...formData,
      image : getImage()
    }
    
   if (editTodoId !== null) {
     updateFn(editTodoId, data);
   } else if (editCategoryId !== null) {
     updateFn(editCategoryId, data);
   } else {
     createFn(data);
   }

   clearImage()
    form.reset();
    clearEditState();
    document.getElementById("todoModal").classList.remove("active");

    onSuccess();
  });
}

