const body = document.body;
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle");



function handleResize() {
  if (window.innerWidth <= 768) {
    sidebar.classList.add("close");
    body.classList.add("sidebar-close");
  } else {
    sidebar.classList.remove("close");
    body.classList.remove("sidebar-close");
  }
}


window.addEventListener("resize", handleResize);
handleResize();

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
  body.classList.toggle("sidebar-close"); 
});

