
const craftsContainer = document.getElementById('crafts-container');
const modal = document.getElementById('myModal');
const modal2=document.getElementById('myModal2');
const close = document.getElementsByClassName('close')[0];
const close2=document.getElementsByClassName('close2')[0];
const popupTitle = document.getElementById('popup-title');
const popupImage = document.getElementById('popup-image');
const popupDescription = document.getElementById('popup-description');
const popupSupplies = document.getElementById('popup-supplies');


const getCrafts=async()=>{
try{
    return (await fetch("api/crafts/")).json();
} catch(error){
    console.log(error);
}
};


// Function to create craft elements
function createCraftElement(craft) {
    console.log('Craft ID:',craft._id);
    const craftDiv = document.createElement('div');
    craftDiv.classList.add('craft');
    console.log("Craft id:",craft._id);
    craftDiv.dataset.craftId = craft._id;
    console.log('Dataset:', craftDiv.dataset);
    


    const image = document.createElement('img');
    image.src = 'images/' + craft.image;
    image.alt = craft.name;

    craftDiv.appendChild(image);
//modal 
craftDiv.addEventListener('click', function () {

        popupTitle.textContent = craft.name;
        popupImage.src = 'images/' + craft.image;
        popupDescription.textContent = "Description: " + craft.description;
        popupSupplies.innerHTML = "Supplies: " + '';
        craft.supplies.forEach(function (supply) {
            const li = document.createElement('li');
            li.textContent= supply;
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
        console.log('Fetched data:',data);
        data.forEach(craft => {
            console.log('Craft Object:',craft);
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
    
    modal2.style.display = "block";
    // Clear previous data
    document.getElementById('name').value = ''; // Clear craft name input
    document.getElementById('description').value = ''; // Clear description input
    document.getElementById('supplies').value='';
    
    // Hide any previously displayed image
    const inputsection = document.getElementById("modal2-content");
    const existingImages = inputsection.querySelectorAll('.inputimg');
    existingImages.forEach(img => img.remove());
    
    // Display the form dialog
   
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
// Save button click event
const saveButton = document.getElementById("savebutton");

saveButton.onclick = async function () {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const supplies = [];
    document.querySelectorAll('.supply-input').forEach(input => {
        supplies.push(input.value);
    });
    
    // Get the craft ID from the dataset of the craft element
    const craftId = popupTitle.parentElement.dataset.craftId;

    // Get the selected image file
    const imageInput = document.getElementById('imagebutton');
    if (imageInput.files.length === 0) {
        console.error('No image selected');
        return;
    }
    const imageFile = imageInput.files[0];
    
    const formData = {
        _id: craftId,
        name: name,
        description: description,
        supplies: supplies,
        image: imageFile,
    };

    console.log('Form Data:',formData);

    // Check if we are editing an existing craft
    const editingCraft = modal.style.display === 'none' && modal2.style.display === 'block';
    
    // If we are editing an existing craft
    if (editingCraft) {
        // Perform the update operation here
        console.log('Editing an existing craft');

        // Update the craft on the server using a PUT request
        await fetch(`/api/crafts/${craftId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(updatedCraft => {
            console.log('Craft successfully updated:', updatedCraft);
            // Update the UI to reflect the changes
            // For example, update the details displayed in the popup
            popupTitle.textContent = updatedCraft.name;
            popupImage.src = 'images/' + updatedCraft.image;
            popupDescription.textContent = "Description: " + updatedCraft.description;
            popupSupplies.innerHTML = "Supplies: " + '';
            updatedCraft.supplies.forEach(function (supply) {
                const li = document.createElement('li');
                li.textContent = supply;
                popupSupplies.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error updating craft:', error);
            // Handle error
        });
    } else {
        // If we are creating a new craft, perform the create operation as before
        console.log('Adding a new craft');
        await fetch('/api/crafts/', {
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

            // Create the craft element after successfully adding the craft
            const craftElement = createCraftElement(formData);
            craftsContainer.appendChild(craftElement);
        })
        .catch(error => {
            console.error('Error saving craft:', error);
            // Handle error
        });
    }
};



// Cancel button click event
const cancelButton = document.getElementById("cancelbutton");

cancelButton.onclick = function () {
    // Hide the form dialog without saving anything
    modal2.style.display = 'none';
};

//new buttons functionality 
const elink=document.getElementById('edit-link');
const dlink=document.getElementById('delete-link');

// Edit function
const editclicked = () => {
    console.log("edit clicked");
    
    // Hide the details dialog
    modal.style.display = 'none';

    // Show the edit dialog
    modal2.style.display = 'block';

    // Populate the edit form with existing data
    document.getElementById('name').value = popupTitle.textContent;
    document.getElementById('description').value = popupDescription.textContent.replace('Description: ', '');

    // Clear previous supplies
    document.getElementById('supply-container').innerHTML = '';

    // Add supplies
    popupSupplies.querySelectorAll('li').forEach(li => {
        const newSupplyInput = document.createElement("input");
        newSupplyInput.type = "text";
        newSupplyInput.placeholder = "Enter supply";
        newSupplyInput.classList.add("supply-input");
        newSupplyInput.value = li.textContent;
        document.getElementById('supply-container').appendChild(newSupplyInput);
    });

    // Display the image in the screenshot
    const imageSrc = popupImage.src;
    if (imageSrc) {
        const screenshotImg = document.getElementById('screenshot-image');
        screenshotImg.src = imageSrc;
    }
};

// Assign editclicked function to the edit link
elink.onclick = editclicked;

//delete
const deleteclicked = () => {
    // Display a styled confirmation dialog
    const confirmation = confirm("Are you sure you want to delete this craft?");
    
    // If user confirms deletion
    if (confirmation) {
        // Perform deletion process (You'll need to implement this)
        const craftId = popupTitle.parentElement.dataset.craftId; // Get craft ID
        deleteCraft(craftId); // Call a function to delete the craft by ID
        
        // Update UI after deletion
        const craftElement = document.querySelector(`[data-craft-id="${craftId}"]`);
        if (craftElement) {
            craftElement.remove(); // Remove deleted craft from the page
        }
    } else {
        // If user cancels deletion, do nothing
        console.log("Deletion cancelled");
    }
    modal2.style.display="none";
};

// Function to delete craft by ID (you need to implement this)
const deleteCraft = async (craftId) => {
    try {
        // Send a DELETE request to the server to delete the craft
        const response = await fetch(`/api/crafts/${craftId}`, {
            method: 'DELETE',
        });

        // Check if deletion was successful
        if (response.ok) {
            console.log('Craft deleted successfully');
        } else {
            console.error('Failed to delete craft');
        }
    } catch (error) {
        console.error('Error deleting craft:', error);

    }
};

// Assign deleteclicked function to the delete link
dlink.onclick = deleteclicked;
