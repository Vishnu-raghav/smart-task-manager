export function populateOptions(selectElement, data, config = {} ){

    const { placeholderText = "Select Option" } = config

    selectElement.innerHTML = "";

    const placeholder = document.createElement("option")
    placeholder.value = ""
    placeholder.textContent = placeholderText
    placeholder.hidden = true
    placeholder.selected = true
    selectElement.appendChild(placeholder)


    data.forEach(item => {
        const option = document.createElement("option")
        option.value = item.id 
        option.textContent = item.name
        selectElement.appendChild(option);
    });

    selectElement.value = "";

}

export function populateCustomDropdown(container, data){
    container.innerHTML = ""

    data.forEach(item => {
        const div = document.createElement("div")
        div.classList.add("dropdown-item")
        div.dataset.id = item.id

        div.innerHTML = `
          <span>${item.name}</span>
          <span class="dots">•••</span>
        `;


        container.appendChild(div)
    })

     const addBtn = document.createElement("div");
     addBtn.classList.add("dropdown-item", "add-new");
     addBtn.innerHTML = `<span>+ Add Priority</span>`;
     container.appendChild(addBtn);

}