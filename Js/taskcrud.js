import {getTodos,saveTodos} from "./storage.js"
import { getCategories, saveCategories } from "./storage.js";



export function createTodo(data) {

  const todos = getTodos();

  const newTodo = {
    id: Date.now(),
    ...data,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos(todos);

  return newTodo
}

export function deleteTodo(id){
  let todos = getTodos()
  todos = todos.filter((todo) => todo.id !== id)

  saveTodos(todos)
}

export function updateTodo(editTodoId,data){
  let todos = getTodos()

  todos = todos.map((todo) =>
    todo.id === editTodoId
      ? { ...todo, ...data }
      : todo
  );

  saveTodos(todos);

}


export function createCategory(data){
  const category = getCategories()

  const newCategory = {
    id : Date.now(),
    ...data,
    isDefault: false 
  }

  category.push(newCategory)
  saveCategories(category)
}


export function deleteCategory(id){
  let category = getCategories()

  category = category.filter(cat => cat.id !== id)
  
  const target = category.find(c => c.id === id)
   if(target?.isDefault) return 

  saveCategories(category)


  let todos = getTodos();
  todos = todos.filter(todo => todo.category != id);
  saveTodos(todos);

}

export function updateCategory(editCategoryId,data){
  let category = getCategories()

   const target = category.find(c => c.id === editCategoryId)
   if(target?.isDefault) return 

  category = category.map((cat) => {
    return cat.id === editCategoryId ? {...cat, ...data} : cat
  })

  saveCategories(category)
  
}