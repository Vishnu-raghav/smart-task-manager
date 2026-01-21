const addTaskBtn = document.querySelector(".Add-Task") 
const closeBtn = document.querySelector(".close-modal")
const todoModal = document.querySelector('#todoModal')

addTaskBtn.addEventListener("click", () => {
      todoModal.classList.add("active")
})

closeBtn.addEventListener("click", () => {
    todoModal.classList.remove("active")
})