import "./sidebar.js";


rerenderPage();

export function rerenderPage() {
  const page = document.body.dataset.page;

  if (page === "dashboard" || page === "myTask"){
  import("./modal.js");
  import("./priority.js")
  import("./filter.js")
  }

  if (page === "dashboard"){
    import("./dashboard.js").then(m => {
      m.renderDashboard();
      m.renderCompletedTodos();
    });
  }

  if (page === "myTask"){
    import("./myTask.js").then(m => {
      m.renderTaskList();
    });
  }

  if (page === "category"){
    
  import("./category.js").then(m => {
    m.renderCategories();
  });
 }

}
