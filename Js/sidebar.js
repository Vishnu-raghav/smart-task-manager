const body = document.body;
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle");          
const mobileBtn = document.querySelector(".mobile-menu-btn"); 

function isMobile(){
  return window.innerWidth <= 768;
}

function handleResize(){
  if(isMobile()){
    sidebar.classList.remove("close");
    body.classList.remove("sidebar-close");
  }else{
    sidebar.classList.remove("open");
  }
}

window.addEventListener("resize", handleResize);
handleResize();

toggle.addEventListener("click", () => {
  if(!isMobile()){
    sidebar.classList.toggle("close");
    body.classList.toggle("sidebar-close");
  }
});

mobileBtn.addEventListener("click", () => {
  if(isMobile()){
    sidebar.classList.toggle("open");
  }
});



