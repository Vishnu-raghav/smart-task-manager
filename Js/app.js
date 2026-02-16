import "./sidebar.js";

rerenderPage();

export function rerenderPage() {
  const page = document.body.dataset.page;
  if (page === "dashboard" || page === "myTask") {
  import("./modal.js");
}
  if (page === "dashboard") {
    import("./dashboard.js").then(m => {
      m.renderTodos();
      m.renderCompletedTodos();
    });
  }

  if (page === "myTask") {
    import("./myTask.js").then(m => {
      m.renderTaskList();
    });
  }

  if (page === "category") {
    
  import("./category.js").then(m => {
    m.renderCategories();
  });
}

}
