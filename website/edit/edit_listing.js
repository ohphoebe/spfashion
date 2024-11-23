$(document).ready(function () {

    var StorageID = localStorage.getItem('clothingID');
    $('#ProductID').val(StorageID);
    
    // Get selected clothing data and image file
    $( '#GetCloth' ).on( 'click', function() {

        // Check if product ID not empty        
        if ($('#ProductID').val() != ""){

            var clothingID = parseInt($('#ProductID').val()); //Remove float input
  
            $('.btn').prop('disabled', true);

            $.ajax({
            
                type: 'GET',
                url: 'http://localhost:5000/clothing/' + clothingID,
                contentType: 'application/json', // header tells the server, data receive is in JSON format
                "headers": {
                    "Content-Type": "application/json",
                },
                success: function (response) {
                    // Handle successful login response
                    $('.btn').prop('disabled', false);
                
                    // Check if data is empty
                    if (response.data.length>0){
                        // Load data value for display
                        $('#name').val(response.data[0].name);
                        $('#Description').val(response.data[0].description);
                        $('#categoryID').val(response.data[0].categoryId);
                        $('#Price').val(response.data[0].price);
                        $('#Quantity').val(response.data[0].quantity);
                        // Specifies the received image is a Base64-encoded image
                        let imageURL = 'data:image;base64,' + response.image;
                        $('#image-placeholder').attr('src', imageURL);
                    
                    }
                    else {
                        //alert("Clothing ID does not exist");
                        $('#modalMessageContent').text("Clothing ID does not exist");
                        $('#ResponseModal').modal('show');
                    }
                },
                error: function (xhr, status, error) {
                    // Handle error response
                    $('.btn').prop('disabled', false);
                    //alert('Get clothing data fail: ' + xhr.responseText);
                    $('#modalMessageContent').text('Get clothing data fail: ' + xhr.responseText);
                    $('#ResponseModal').modal('show');
                }
            });

        }

        else {
            //alert("Clothing ID is empty");
            $('#modalMessageContent').text("Clothing ID is empty");
            $('#ResponseModal').modal('show');
        }
     
    });
   
    //Auto trigger get clothing event
    $('#GetCloth').trigger('click');

    // To send all form data, no image file
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
            
            //get token, get ID for route  
            var token = localStorage.getItem('jwt');
            var clothingID = $('#ProductID').val();

            // Get the form data
            var name = $('#name').val();
            var description = $('#Description').val();
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
                const data = {
                    "name": name,
                    "description": description,
                    "categoryId": categoryId,
                    "price": price,
                    "quantity": quantity
                };
            
                // Make the PUT request using jQuery
                $.ajax({
                    
                    type: 'PUT',
                    url: 'http://localhost:5000/clothing/' + clothingID,
                    contentType: 'application/json',  // data being sent in the request body is in JSON format
                    "headers": {
                        "Content-Type": "application/json",  // header tells the server, data sent is in JSON format
                        "Authorization": "Bearer " + token
                    },
                    data: JSON.stringify(data), // serialization. Converts data into a JSON-formatted string. 
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
                        //alert('Updating clothing database fail: ' + xhr.responseText);
                        $('#modalMessageContent').text('Updating clothing database fail: ' + xhr.responseText);
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
    
    // To send only image file
    $("#SubmitImage").on("click", function () {

        // To avoid people entering the page without login
        if (!localStorage["jwt"] || !localStorage["role"]) {
            delete localStorage["jwt"];
            delete localStorage["role"];
            delete localStorage["name"];
            delete localStorage["clothingID"];
            location.href = "../login/login.html";
        } 
        else {

            $('.btn').prop('disabled', true);
            // create form object, get clothingID for route, get token
            var formdata = new FormData();
            var clothingID = $('#ProductID').val();
            var token = localStorage.getItem('jwt');

            // Check if image is selected and clothing ID is enter
            if ($('#ImageFile').val() == 0) {
                $('.btn').prop('disabled', false);
                //alert("File input is empty.");
                $('#modalMessageContent').text("File input is empty.");
                $('#ResponseModal').modal('show');
            }
            else if ($('#ProductID').val() == 0) {
                $('.btn').prop('disabled', false);
                //alert("Clothing ID is empty.");
                $('#modalMessageContent').text("Clothing ID is empty.");
                $('#ResponseModal').modal('show');
            }
            else {

                formdata.append("image", $('#ImageFile')[0].files[0]); //append image file to formdata

                $.ajax({

                    type: 'PUT',
                    url: 'http://localhost:5000/clothing/image/' + clothingID,
                    enctype: 'multipart/form-data', // allows the data to be sent as a "multipart" request, for form fields and file uploads in separate parts.
                    cache: false, //  disable caching to ensure always get the latest data from the server
                    processData: false, // Prevent jQuery from automatically transforming the data into a query string
                    contentType: false, // Set content type to false as FormData handles the content type
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    data: formdata, //send data

                    success: function (response) {

                        $('.btn').prop('disabled', false);
                        //alert(response.Message)
                        $('#modalMessageContent').text(response.Message);
                        $('#ResponseModal').modal('show');

                    },
                    error: function (xhr, status, error) {
                        $('.btn').prop('disabled', false);
                        //alert('Updating clothing image fail: ' + xhr.responseText + 'No Clothing ID');
                        $('#modalMessageContent').text('Updating clothing image fail: ' + xhr.responseText + 'No Clothing ID');
                        $('#ResponseModal').modal('show');
                    }
                });

            }
        }
    });
       
    $("#ImageFile").on("change", function (event) {
        // Get the selected file from the input element
        const selectedFile = event.target.files[0];

        // Check if a file was selected
        // Check if the file is an image based on its MIME type, "image/jpeg", "image/png", "image/gif"
        if (selectedFile.type.startsWith("image/")) {
            // Read the file as a URL and display it in the image element
            const reader = new FileReader(); //Create FileReader object, reader. This API read the contents of a file asynchronously
            // Trigger after file is successfully read
            reader.onload = function (event) {
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

    $("#ToAdd").hide();

    $("#ToAdd").on("click", function () {
        $(location).attr('href', '../add/add_listing.html');
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