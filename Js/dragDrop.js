import { getTodos, saveTodos } from "./storage.js";
import { rerenderPage } from "./app.js";

let draggedTaskId = null;
let isInitialized = false;

// export function initDragAndDrop() {

//       if (isInitialized) return; 
//       isInitialized = true;

//   document.addEventListener("dragstart", (e) => {
//     const task = e.target.closest(".task-item")
    
//     if(task){
//       console.log("drag started");
//           draggedTaskId = e.target.dataset.id;
//           e.target.classList.add("dragging");
//     }
  
//   });

// }

// document.addEventListener("dragend", (e) => {
//   if (e.target.classList.contains("task-item")) {
//     e.target.classList.remove("dragging");
//   }
// });

// document.addEventListener("dragover", (e) => {
//   const card = e.target.closest(".category-card");
//   if (!card) return;

//   e.preventDefault();

//   document
//     .querySelectorAll(".category-card")
//     .forEach(c => c.classList.remove("drag-over"));

//   card.classList.add("drag-over");
// });

//  document.addEventListener("drop", (e) => {
//   const card = e.target.closest(".category-card");
//   if (!card) return;

//   const newCategoryId = Number(card.dataset.id);

//   moveTask(draggedTaskId, newCategoryId);

//   document
//     .querySelectorAll(".category-card")
//     .forEach(c => c.classList.remove("drag-over"));
// });


// function moveTask(taskId, newCategoryId) {
//   let todos = getTodos();

//   const task = todos.find(t => t.id == taskId);
//   if (!task) return;

//   if (task.category == newCategoryId) return;

//   task.category = newCategoryId;

//   saveTodos(todos);

//   rerenderPage(); 
// }


export function initDragAndDrop() {
  if (isInitialized) return;
  isInitialized = true;

  document.addEventListener("dragstart", (e) => {
    const task = e.target.closest(".task-item");
    if (task) {
      draggedTaskId = task.dataset.id; 
      task.classList.add("dragging");
    }
  });

  document.addEventListener("dragend", (e) => {
    const task = e.target.closest(".task-item");
    if (task) {
      task.classList.remove("dragging");
    }
  });

  document.addEventListener("dragover", (e) => {
    const card = e.target.closest(".category-card");
    if (!card) return;
    e.preventDefault();


    document
      .querySelectorAll(".category-card")
      .forEach(c => c.classList.remove("drag-over"));

    card.classList.add("drag-over");
  });

  document.addEventListener("drop", (e) => {
    const card = e.target.closest(".category-card");
    if (!card) return;

    const newCategoryId = Number(card.dataset.id);

    moveTask(draggedTaskId, newCategoryId);

    document
      .querySelectorAll(".category-card")
      .forEach(c => c.classList.remove("drag-over"));
  });
}


 function moveTask(taskId, newCategoryId) {
   let todos = getTodos();

  const task = todos.find(t => t.id == taskId);
   if (!task) return;

   if (task.category == newCategoryId) return;

  task.category = newCategoryId;

   saveTodos(todos);

   rerenderPage(); 
}