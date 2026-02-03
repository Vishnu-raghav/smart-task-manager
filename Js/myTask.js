import { getTodos } from "./storage.js";
import {renderTodos} from "./dashboard.js"
const rightPanel = document.querySelector(".grid-right-area")
const todolist = document.querySelector(".task-card-section")


renderTodos()