import {getTodos,saveTodos} from "./storage.js"


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