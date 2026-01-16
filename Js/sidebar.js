const body = document.querySelector("body")
     sidebar = body.querySelector(".sidebar")
     toggle = body.querySelector(".toggle")



function handleResize(){
     if(window.innerWidth <= 768){
          sidebar.classList.add("close")
     }else{
          sidebar.classList.remove("close")
     }
}

window.addEventListener("resize", handleResize);
handleResize()
toggle.addEventListener("click", () => {
     sidebar.classList.toggle("close")
})