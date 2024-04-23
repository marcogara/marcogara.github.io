const image_input = document.querySelector("#image-unput");
var upluaded_image = "";

image_input.addEventListener("change", function() {
    const reader = new FileReader;
    reader.addEventListener("load", () => {
        uploaded_image = reader.result;
        // Do something with the uploaded image, e.g. display it
        uploaded_image = reader.result;
        document.querySelector("#display_image").style.backgroundImage = 'url(${uploaded_image})';
    }); 
    reader.readAsDataURL(this.files[0]);    
})