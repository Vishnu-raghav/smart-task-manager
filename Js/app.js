
// function showImage(file){
//   if(!file || !file.type.startsWith("image/")) {
//     alert("Please upload an image file");
//     return;
//   }

//   if(file.size > 2 * 1024 * 1024){
//     alert("Image must be less than 2MB");
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = () => {
//     previewImg.src = reader.result;
//     previewImg.style.display = "block";
//     document.querySelector(".upload-content").style.display = "none";
//   };
//   reader.readAsDataURL(file);
// }


// const todo = {
//   id: Date.now(),
//   title: taskTitle.value,
//   priority: taskPriority.value,
//   date: taskDate.value,
//   desc: taskDesc.value,
//   image: previewImg.src || null,
//   completed: false
// }

