import "./modal.js";
import "./sidebar.js";

const page = document.body.dataset.page;

rerenderPage();

export function rerenderPage() {
  const page = document.body.dataset.page;

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
}
