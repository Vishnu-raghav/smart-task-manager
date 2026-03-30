const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle");
const mobileBtn = document.querySelector(".mobile-menu-btn");

function isMobile() {
  return window.innerWidth <= 768;
}

(function () {
  const saved = localStorage.getItem("sidebar");

  if (saved === "closed" && !isMobile()) {
    sidebar.classList.add("close");
    document.body.classList.add("sidebar-close");
  }
})();

window.addEventListener("load", () => {
  document.documentElement.classList.remove("no-transition");
  document.documentElement.classList.remove("sidebar-pre-close");
});

toggle.addEventListener("click", () => {
  if (!isMobile()) {
    sidebar.classList.toggle("close");
    document.body.classList.toggle("sidebar-close");

    const isClosed = sidebar.classList.contains("close");
    localStorage.setItem("sidebar", isClosed ? "closed" : "open");
  }
});

mobileBtn.addEventListener("click", () => {
  if (isMobile()) {
    sidebar.classList.toggle("open");
  }
});