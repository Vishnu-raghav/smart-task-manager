import "./sidebar.js";


rerenderPage();

export function rerenderPage() {
  const page = document.body.dataset.page;

  if (page === "dashboard" || page === "myTask"){
  import("./modal.js");
  import("./priority.js")
  import("./filter.js")
  import("./search.js")
  }

  if (page === "dashboard"){
    import("./dashboard.js").then(m => {
      m.renderDashboard()
    });
  }

  if (page === "myTask"){
    import("./myTask.js").then(m => {
      m.renderMyTaskDashboard();
    });
  }

  if (page === "category"){
    import("./search.js")

    
  import("./category.js").then(m => {
    m.renderCategories();
  });
 }

}
