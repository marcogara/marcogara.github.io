// Select all image containers
const imageContainers = document.querySelectorAll(".image-container");

// Iterate over each image container
imageContainers.forEach((container, index) => {
    const imageInput = container.querySelector(".image-input");
    const displayImage = container.querySelector(".display-image");
    const uploadInfo = container.querySelector(".upload-info");

    let uploadedImage = "";

    // Add change event listener to image input
    imageInput.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            uploadedImage = reader.result;
            // Display the uploaded image
            displayImage.style.backgroundImage = `url('${uploadedImage}')`;

            // Get current date and time
            const dateTime = new Date().toLocaleString();
            // Display date and time under the image
            uploadInfo.textContent = `Uploaded on: ${dateTime}`;
        });
        reader.readAsDataURL(this.files[0]);
    });
});
