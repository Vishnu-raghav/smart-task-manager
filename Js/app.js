console.log("loaded")
const form = document.getElementById("todoForm");

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  const data = JSON.parse(localStorage.getItem("todos"));
  console.log(data)
  return Array.isArray(data) ? data : [];
}

function createTodo(){
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const newTodo = {
    id: Date.now(),
    title: data.title,
    description: data.desc,
    image: previewImg.src || null,
    priority: data.priority,
    dueDate: data.dueDate,
    completed: false,
  };

  let oldTodo = getTodos();
  oldTodo.push(newTodo);
  saveTodos(oldTodo);

  form.reset();

  previewImg.src = "";
  previewImg.style.display = "none";
  document.querySelector(".upload-content").style.display = "flex";

  renderTodos();  
}


function renderTodos() {
  try {
    let todos = getTodos();
    todos.forEach(task => {
      console.log(task);
    });
  } catch (error) {
    console.log(error);
  }
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  createTodo();
});

renderTodos()