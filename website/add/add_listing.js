$(document).ready(function () {

    // To send all form data and image file. 
    $('#ToSend').submit(function (event) {

        // To avoid people entering the page without login
        if (!localStorage["jwt"] || !localStorage["role"]) {
            delete localStorage["jwt"];
            delete localStorage["role"];
            delete localStorage["name"];
            delete localStorage["clothingID"];
            location.href = "../login/login.html";
        } 
        else {
            event.preventDefault();

            $('.btn').prop('disabled', true);

            //Set validation check
            var success = true;
            var errorMessage = "";

            // create form object
            var formData = new FormData();
            
            // Get token
            var token = localStorage.getItem('jwt');
    
            // Get the form data
            var name = $('#name').val();
            var description = $('#Description').val();
            var image = $('#ImageFile')[0].files[0];
            var categoryId = $('#categoryID').val();
            var price = $('#Price').val();
            price = Number.parseFloat(price).toFixed(2);
            var quantity = $('#Quantity').val();
            quantity = Number.parseInt(quantity,10);
            
            // Validation check            
            if(name.length > 45){
                success = false;
                errorMessage += "Name too long, maximum 45 character. ";
            }
            else if(name.length == 0){
                success = false;
                errorMessage += "Name cannot be empty. ";
            }

            if(!image){
                success = false;
                errorMessage += "No image input. ";
            }

            if(description.length > 250){
                success = false;
                errorMessage += "Description too long, maximum 250 character. ";
            }
            else if(description.length == 0){
                success = false;
                errorMessage += "Description cannot be empty. ";
            }
            
            if(quantity > 9999999){
                success = false;
                errorMessage += "Maximum quantity allow is 9999999. ";
            }
            else if(quantity < 0){
                success = false;
                errorMessage += "Quantity input cannot negative. ";
            }
            else if(isNaN(quantity)){
                success = false;
                errorMessage += "Quantity input cannot empty. ";
            }
           
            if(price > 999.99){
                success = false;
                errorMessage += "Maximum price allow is 999.99. ";
            }
            else if(price < 0){
                success = false;
                errorMessage += "Price input cannot negative. ";
            }
            else if(isNaN(price)){
                success = false;
                errorMessage += "Price input cannot empty. ";
            }

            if(success == true){

                // Create the data object to send in the POST request
                formData.append('name',name);
                formData.append('description',description);
                formData.append('categoryId',categoryId);
                formData.append('price',price);
                formData.append('quantity',quantity);
                formData.append('image',image);
                
                // Make the POST request using jQuery
                $.ajax({
                    
                    type:'POST',
                    url: 'http://localhost:5000/clothing',
                    enctype: 'multipart/form-data', // allows the data to be sent as a "multipart" request, for form fields and file uploads in separate parts.
                    cache: false, //  disable caching to ensure always get the latest data from the server
                    processData: false, // Prevent jQuery from automatically transforming the data into a query string
                    contentType: false, // Set content type to false as FormData handles the content type
                    headers: {
                        'Authorization': 'Bearer ' + token 
                    },
                    data: formData, //send data
                    success: function (response) {
                        // Handle successful login response
                        $('.btn').prop('disabled', false);
                        //alert(response.Message); // Assuming the server sends a JSON response with a "message" key
                        $('#modalMessageContent').text(response.Message);
                        $('#ResponseModal').modal('show');
                        
                    },
                    error: function (xhr, status, error) {
                        // Handle error response
                        $('.btn').prop('disabled', false);
                        //alert('Add to clothing database fail: ' + xhr.responseText);
                        $('#modalMessageContent').text('Add to clothing database fail: ' + xhr.responseText);
                        $('#ResponseModal').modal('show');
                    }
                                
                });
            }
            else {
                
                $('.btn').prop('disabled', false);
                $('#modalMessageContent').text(errorMessage);
                $('#ResponseModal').modal('show');
            }
        }     
    });

    // Load image file for display
    $("#ImageFile").on("change", function(event) {
        // Get the selected file from the input element
        const selectedFile = event.target.files[0];
              
        // Check if a file was selected
        // Check if the file is an image based on its MIME type, "image/jpeg", "image/png", "image/gif"
        if (selectedFile.type.startsWith("image/")) {
            // Read the file as a URL and display it in the image element
            const reader = new FileReader(); //Create FileReader object, reader. This API read the contents of a file asynchronously
            // Trigger after file is successfully read
            reader.onload = function(event) {
            $("#image-placeholder").attr("src", event.target.result);
            };
            // read the file, afterwhich trigger above event
            reader.readAsDataURL(selectedFile);
        }
        else {
            alert("Please select an image file.");
            
            $("#ImageFile").val("");
          }
    });
  
    $("#ToEdit").hide();

    $( "#ToEdit" ).on( "click", function(){
        $(location).attr('href','../edit/edit_listing.html');
    });

    $('#Toclear').on("click", function(){
        $("#image-placeholder").attr("src", "productImage.jpg");
    });

    //logout: get rid of localStorage
    $("#logout").on("click", function () {
        delete localStorage["jwt"];
        delete localStorage["role"];
        delete localStorage["clothingID"];
        delete localStorage["name"];
        location.href = "../login/login.html";
    });

});