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

    const NewTodo = {
        id : Date.now(),
        title : data.title,
        description : data.desc,
        image : previewImg.src || null,
        priority : data.priority,
        dueDate : data.dueDate,
    }

    let oldTodo = getTodos()
    oldTodo.push(NewTodo)

    saveTodos(oldTodo)

      console.log("Saved Todos:", oldTodo);

      form.reset()



})




