const craftsContainer = document.getElementById('crafts-container');
const modal = document.getElementById('myModal');
const modal2=document.getElementById('myModal2');
const close = document.getElementsByClassName('close')[0];
const close2=document.getElementsByClassName('close2')[0];
const popupTitle = document.getElementById('popup-title');
const popupImage = document.getElementById('popup-image');
const popupDescription = document.getElementById('popup-description');
const popupSupplies = document.getElementById('popup-supplies');

// Function to create craft elements
function createCraftElement(craft) {
    const craftDiv = document.createElement('div');
    craftDiv.classList.add('craft');

    const image = document.createElement('img');
    image.src = 'images/' + craft.image;
    image.alt = craft.name;

    craftDiv.appendChild(image);

    craftDiv.addEventListener('click', function () {
        popupTitle.textContent = craft.name;
        popupImage.src = 'images/' + craft.image;
        popupDescription.textContent = "Description: " + craft.description;
        popupSupplies.innerHTML = "Supplies: " + '';
        craft.supplies.forEach(function (supply) {
            const li = document.createElement('li');
            li.textContent = supply;
            popupSupplies.appendChild(li);
        });
        modal.style.display = 'block';
    });

    return craftDiv;
}

// Populate crafts from JSON file
fetch('json/crafts.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(craft => {
            const craftElement = createCraftElement(craft);
            craftsContainer.appendChild(craftElement);
        });
    })
    .catch(error => console.error('Error fetching crafts:', error));

// Close modal when X button is clicked
close.onclick = function () {
    modal.style.display = 'none';
}

// Close modal when user clicks outside the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Open form on click
const plus = document.getElementById('addlink');

const toggleplus = () => {
    // Clear previous data
    document.getElementById('name').value = ''; // Clear craft name input
    document.getElementById('description').value = ''; // Clear description input
    // Assuming you have inputs for supplies, clear them here as well
    
    // Hide any previously displayed image
    const inputsection = document.getElementById("modal2-content");
    const existingImages = inputsection.querySelectorAll('.inputimg');
    existingImages.forEach(img => img.remove());
    
    // Display the form dialog
    modal2.style.display = "block";
}

plus.onclick = toggleplus;
// Close modal when 'Cancel' button is clicked
close2.onclick = function () {
    modal2.style.display = 'none';
}

// Close modal when user clicks outside the modal
window.onclick = function (event) {
    if (event.target == modal2) {
        modal2.style.display = 'none';
    }
}

// imagebutton click event
const imagebutton = document.getElementById("imagebutton");
const imageInput = document.createElement("input");
imageInput.type = "file";

// Event listener for when an image is selected
imageInput.onchange = function (event) {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
        const inputimg = document.createElement("img");
        inputimg.classList.add("inputimg");
        inputimg.src = URL.createObjectURL(file); // Set the src attribute of the inputimg to display the selected image
        
        const inputsection = document.getElementById("modal2-content");
        
        // Remove any existing image elements
        const existingImages = inputsection.querySelectorAll('.inputimg');
        existingImages.forEach(img => img.remove());
        
        inputsection.appendChild(inputimg); // Append the inputimg to the modal2-content
        
        // Update the file input element with the selected file
        imageInput.files = event.target.files;
    }
};


// Add Supply button click event
const addSupplyButton = document.getElementById("supplybutton");

addSupplyButton.onclick = function () {
    const supplyContainer = document.getElementById("supply-container");
    
    const newSupplyInput = document.createElement("input");
    newSupplyInput.type = "text";
    newSupplyInput.placeholder = "Enter supply";
    newSupplyInput.classList.add("supply-input"); // Assign the class for supplies input
    
    supplyContainer.appendChild(newSupplyInput);
};

// Save button click event
const saveButton = document.getElementById("savebutton");

saveButton.onclick = function () {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const supplies = [];
    document.querySelectorAll('.supply-input').forEach(input => {
        supplies.push(input.value);
    });
    
    // Get the selected image file
    const imageInput = document.getElementById('imagebutton');
    if (imageInput.files.length === 0) {
        // Handle the case when no file is selected
        console.error('No image selected');
        return;
    }
    const imageFile = imageInput.files[0];
    const imageUrl = URL.createObjectURL(imageFile);

    const formData = {
        name: name,
        description: description,
        supplies: supplies,
        image: imageUrl
    };
    
    fetch('/api/crafts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Craft successfully added:', data);
        
        modal2.style.display = 'none';
        // Refresh the data on the page to add the new item
        // You may need to reload the entire page or update the crafts list from the response data
    })
    .catch(error => {
        console.error('Error saving craft:', error);
        // Handle error
    });
};





// Cancel button click event
const cancelButton = document.getElementById("cancelbutton");

cancelButton.onclick = function () {
    // Hide the form dialog without saving anything
    modal2.style.display = 'none';
};




