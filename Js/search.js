import { getTodos, getCategories } from "./storage.js";

const searchModal = document.getElementById("todoDropdown")
const searchBar = document.getElementById("task-search-input")

searchBar.addEventListener("input", () => {
   const query = searchBar.value.trim()
    
   if (query) {
      searchModal.classList.add("show");
   } else {
      searchModal.classList.remove("show");
   }
   
   searchquery(query)
})



function searchquery(query){
  searchModal.innerHTML = ""
   
  const todos = getTodos()
  const title = todos.forEach(todo => {
  const title = todo.title

  const found = title
  .toLowerCase()
  .includes(query.toLowerCase());

  console.log(found);
  if(found){
    renderSearchResult(todo)
  }else{
    console.log("not found")
  }
  })
}

function renderSearchResult(todo){
    const categories = getCategories()
    const categoryObj = categories.find(c => c.id === Number(todo.category));
    console.log(categoryObj)
    
    const div = document.createElement("div")
    div.className = "search-output"
    div.dataset.id = todo.id
    div.innerHTML = `
    <p>${todo.title}</p>
    <span>${categoryObj ? `${categoryObj.name}` : `General`}</span>
    `
    searchModal.appendChild(div)
}
