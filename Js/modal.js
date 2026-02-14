import { isFormValid, isEditChanged, attachFormSubmit } from "./formUtils.js";
import { getEditState, clearEditState } from "./taskActions.js";

const form = document.getElementById("todoForm");
const submitBtn = document.querySelector('button[type="submit"]');
const todoModal = document.getElementById("todoModal");
const closeBtns = document.querySelectorAll(".close-modal");

closeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    clearEditState()
    todoModal.classList.remove("active");
  });
});
attachFormSubmit(form)
const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("modal-file-input");
const previewImg = document.getElementById("previewImg");
const browseBtn = document.querySelector(".browse-btn");
const uploadContent = document.querySelector(".upload-content");

browseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.click();
});

uploadBox.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  showImage(fileInput.files[0]);
});

uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.classList.add("active");
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.classList.remove("active");
});

uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBox.classList.remove("active");
  showImage(e.dataTransfer.files[0]);
});

function showImage(file){
  if(!file || !file.type.startsWith("image/")){
    alert("Please upload an image file");
    return;
  }

  if(file.size > 2 * 1024 * 1024){
    alert("Image must be less than 2MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
    previewImg.style.display = "block";
    uploadContent.style.display = "none";
  };
  reader.readAsDataURL(file);
}

form.addEventListener("input", () => {
  const { editTodoId } = getEditState();

  if (editTodoId === null) {
    submitBtn.disabled = !isFormValid(form);
  } else {
    submitBtn.disabled = !isEditChanged(form);
  }
});
