$(function () {
    //to avoid people entering the page without login
    if (!localStorage["jwt"] || !localStorage["role"]) {
        delete localStorage["jwt"];
        delete localStorage["role"];
        delete localStorage["name"];
        delete localStorage["clothingID"];
        location.href = "../login/login.html";
    } else {

        //default display listing view
        //ajaxcall: get product listing from database and display in page
        var settings = {
            "url": "http://localhost:5000/list/logs",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage["jwt"]
            },
        };
        $.ajax(settings).done(function (response) {
            if (response.message == "user") {
                location.href = "../products/products.html";
            } else {
                // Handle the response data
                logsList = response.logs
                $.each(logsList, function (i) {
                    var oneLog = Object.values(logsList)[i]
                    var logID = oneLog["#"]
                    var timestamp = oneLog["timestamp"]
                    var name = oneLog["name"]
                    var action = oneLog["action"]
                    var message = oneLog["message"]

                    $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${logID}</td>
                    <td class="text-left pl-4 align-middle">${timestamp}</td>
                    <td class="text-left align-middle">${name}</td>
                    <td class="text-left align-middle">${action}</td>
                    <td class="text-left align-middle">${message}</td>
                </tr>`
                    )
                })
            }

        })




        //logout: get rid of localStorage
        $("#logout").on("click", function () {
            delete localStorage["jwt"];
            delete localStorage["role"];
            delete localStorage["name"];
            delete localStorage["clothingID"];
            location.href = "../login/login.html";
        })

    }
})