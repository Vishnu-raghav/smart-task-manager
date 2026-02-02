import "./modal.js";
import "./sidebar.js";

const page = document.body.dataset.page;

if (page === "dashboard") {
  import("./dashboard.js");
}

if (page === "myTask") {
  import("./myTask.js");
}

