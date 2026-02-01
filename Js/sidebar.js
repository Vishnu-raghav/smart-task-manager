// const body = document.body;
// const sidebar = document.querySelector(".sidebar");
// const toggle = document.querySelector(".toggle");          
// const mobileBtn = document.querySelector(".mobile-menu-btn"); 

function isMobile(){
  return window.innerWidth <= 768;
}

function handleResize(){
  if(isMobile()){
    document.querySelector(".sidebar").classList.remove("close");
    document.querySelector(".sidebar").classList.remove("open");
    document.body.classList.remove("sidebar-close");
  } else {
    document.querySelector(".sidebar").classList.remove("open");
    document.querySelector(".sidebar").classList.remove("close");      
    document.body.classList.remove("sidebar-close"); 
  }
}

handleResize();
window.addEventListener("resize", handleResize);

document.querySelector(".toggle").addEventListener("click", () => {
  if(!isMobile()){
    document.querySelector(".sidebar").classList.toggle("close");
    document.body.classList.toggle("sidebar-close");
  }
});

document.querySelector(".mobile-menu-btn").addEventListener("click", () => {
  if(isMobile()){
    document.querySelector(".sidebar").classList.toggle("open");
  }
});



