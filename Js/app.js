console.log("loaded")
const form = document.getElementById("todoForm");
const todoCardSection = document.querySelector(".task-card-section")

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
  todoCardSection.innerHTML = ``
  try {
    let todos = getTodos();
    todos.forEach(task => {
      const repoCard = document.createElement("div")
      repoCard.setAttribute("class","todo-card")
      console.log(task)

      repoCard.innerHTML = `
              <div class="task-card">
                <div class="task-checkbox">
                  <input type="checkbox" />
                </div>
                <div class="task-details">
                  <span>${task.title || "no title"}</span>
                  <p>${task.description || "No desription"}</p>
                </div>
               ${task.image && `
                <div class="img-card">
                  <img class="task-img" src="${task.image}" alt="img">
                </div>
               `}
              </div>
              <div class="task-Progress">
                <p class="progress-key">
                  Priority: <span class="progress-value">${task.priority}</span>
                </p>
                <p class="progress-key">
                  Status: <span class="progress-value">${task.completed ? "Completed" : "in progress"}</span>
                </p>
                <p class="progress-key">
                  Created on <span class="progress-value"> ${task.dueDate || "1 dec 2026"}</span>
                </p>
              </div>
      `
       todoCardSection.appendChild(repoCard)
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