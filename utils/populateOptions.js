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