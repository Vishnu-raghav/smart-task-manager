// const todo = {
//   id: Date.now(),
//   title: taskTitle.value,
//   priority: taskPriority.value,
//   date: taskDate.value,
//   desc: taskDesc.value,
//   image: previewImg.src || null,
//   completed: false
// }

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

const addTaskButton = document.querySelector(".Add-Task")
const form = document.getElementById("todoForm")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    console.log(data.desc)
})




