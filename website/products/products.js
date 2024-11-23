$(function () {
    //to avoid people entering the page without login
    if (!localStorage["jwt"] || !localStorage["role"]) {
        delete localStorage["jwt"];
        delete localStorage["role"];
        delete localStorage["name"];
        delete localStorage["clothingID"];
        location.href = "../login/login.html";
    } else {
        //when click on label, arrow is disabled from rotating
        var filterByTxt = $('span#filterSpan');
        var sortByTxt = $('span#sortSpan');
        filterByTxt.on("click", function (e) {
            $("#filterDropdown").removeClass("rotate");
        });
        sortByTxt.on("click", function (e) {
            $("#sortDropdown").removeClass("rotate");
        });

        //rotate arrow when open select category menu
        $("#filterDropdown").on("click", function () {
            $(this).toggleClass("rotate")
        })

        //detect click outside category select box to revert arrow back to original rotation
        $(document).on("click", function (e) {
            var obj = $("#filterDropdown");
            if (!obj.is(e.target) && !obj.has(e.target).length) {
                $("#filterDropdown").removeClass("rotate");
            }
        });

        //rotate arrow when open select sort menu
        $("#sortDropdown").on("click", function () {
            $(this).toggleClass("rotate")
        })

        //detect click outside select sort box to revert arrow back to original rotation
        $(document).on("click", function (e) {
            var obj = $("#sortDropdown");
            if (!obj.is(e.target) && !obj.has(e.target).length) {
                $("#sortDropdown").removeClass("rotate");
            }
        });

        //if role in localStorage is user, hide delete and edit column and "add new" button
        if (localStorage["role"] === "user") {
            $("th.actions").attr("style", "display: none !important;");
            $("#addNew").attr("style", "display: none !important;");
            $("#navLogs").attr("style", "display: none !important;");
        }

        //default display listing view
        //ajaxcall: get product listing from database and display in page
        var settings = {
            "url": "http://localhost:5000/clothing/getall",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage["jwt"]
            },
        };
        $.ajax(settings).done(function (response) {
            // Handle the response data
            clothingList = response.clothing
            $.each(clothingList, function (i) {
                var oneClothing = Object.values(clothingList)[i]
                var clothingID = oneClothing["clothingID"]
                var name = oneClothing["name"]
                var description = oneClothing["description"]
                var image_url = "../../server/" + oneClothing["image_url"]
                var categoryName = oneClothing["categoryName"]
                var price = oneClothing["price"]
                var quantity = oneClothing["quantity"]
                $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                    <!--edit btn-->
                    <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                    <!--delete btn-->
                    <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                )
                //if role in localStorage is user, hide delete and edit buttons
                if (response.message === "user") {
                    $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                    $("#navLogs").attr("style", "display: none !important;");
                }
            })
        })

        //on click of sort dropdown menu/filter dropdown menu
        $("#sortDropdown,#filterDropdown").on("change", function () {
            //sort by dropdown
            var sort = $("#sortDropdown").val()
            //sort by dropdown
            var filter = $("#filterDropdown").val()

            //sort clothing by price low to high
            if ((sort === "low to high") && (filter === "")) {
                //ajaxcall: get product listing from database and display in page
                var settings = {
                    "url": "http://localhost:5000/clothing/getClothingByPriceLowToHigh",
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage["jwt"]
                    },
                };
                $.ajax(settings).done(function (response) {
                    $("#listingTable>tbody").html("")
                    // Handle the response data
                    clothingList = response.clothing
                    $.each(clothingList, function (i) {
                        var oneClothing = Object.values(clothingList)[i]
                        var clothingID = oneClothing["clothingID"]
                        var name = oneClothing["name"]
                        var description = oneClothing["description"]
                        var image_url = "../../server/" + oneClothing["image_url"]
                        var categoryName = oneClothing["categoryName"]
                        var price = oneClothing["price"]
                        var quantity = oneClothing["quantity"]
                        $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                    <!--edit btn-->
                    <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                    <!--delete btn-->
                    <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                        )
                        //search bar (without on click search btn)
                        //make search input lowercase to match with text in td cell
                        var searchVal = $("#searchInput").val().toLowerCase();
                        $("#listingTable>tbody tr").each(function () {
                            //find the text of the first td cell (name of product) in each tr and make it lowercase
                            var cellVal = $(this).find("td:first").text().toLowerCase();
                            if (cellVal.indexOf(searchVal) !== -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                        //if role in localStorage is user, hide delete and edit buttons
                        if (response.message === "user") {
                            $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                            $("#navLogs").attr("style", "display: none !important;");
                        }
                    })
                })
            }
            //sort clothing by price high to low
            else if ((sort === "high to low") && (filter === "")) {
                //ajaxcall: get product listing from database and display in page
                var settings = {
                    "url": "http://localhost:5000/clothing/getClothingByPriceHighToLow",
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage["jwt"]
                    },
                };
                $.ajax(settings).done(function (response) {
                    $("#listingTable>tbody").html("")
                    // Handle the response data
                    clothingList = response.clothing
                    $.each(clothingList, function (i) {
                        var oneClothing = Object.values(clothingList)[i]
                        var clothingID = oneClothing["clothingID"]
                        var name = oneClothing["name"]
                        var description = oneClothing["description"]
                        var image_url = "../../server/" + oneClothing["image_url"]
                        var categoryName = oneClothing["categoryName"]
                        var price = oneClothing["price"]
                        var quantity = oneClothing["quantity"]
                        $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                    <!--edit btn-->
                    <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                    <!--delete btn-->
                    <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                        )
                        //search bar (without on click search btn)
                        //make search input lowercase to match with text in td cell
                        var searchVal = $("#searchInput").val().toLowerCase();
                        $("#listingTable>tbody tr").each(function () {
                            //find the text of the first td cell (name of product) in each tr and make it lowercase
                            var cellVal = $(this).find("td:first").text().toLowerCase();
                            if (cellVal.indexOf(searchVal) !== -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                        //if role in localStorage is user, hide delete and edit buttons
                        if (response.message === "user") {
                            $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                            $("#navLogs").attr("style", "display: none !important;");
                        }
                    })
                })
            }
            //sort clothing by name a to z
            else if ((sort === "a to z") && (filter === "")) {
                //ajaxcall: get product listing from database and display in page
                var settings = {
                    "url": "http://localhost:5000/clothing/getClothingByNameAToZ",
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage["jwt"]
                    },
                };
                $.ajax(settings).done(function (response) {
                    $("#listingTable>tbody").html("")
                    // Handle the response data
                    clothingList = response.clothing
                    $.each(clothingList, function (i) {
                        var oneClothing = Object.values(clothingList)[i]
                        var clothingID = oneClothing["clothingID"]
                        var name = oneClothing["name"]
                        var description = oneClothing["description"]
                        var image_url = "../../server/" + oneClothing["image_url"]
                        var categoryName = oneClothing["categoryName"]
                        var price = oneClothing["price"]
                        var quantity = oneClothing["quantity"]
                        $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                    <!--edit btn-->
                    <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                    <!--delete btn-->
                    <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                        )
                        //search bar (without on click search btn)
                        //make search input lowercase to match with text in td cell
                        var searchVal = $("#searchInput").val().toLowerCase();
                        $("#listingTable>tbody tr").each(function () {
                            //find the text of the first td cell (name of product) in each tr and make it lowercase
                            var cellVal = $(this).find("td:first").text().toLowerCase();
                            if (cellVal.indexOf(searchVal) !== -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                        //if role in localStorage is user, hide delete and edit buttons
                        if (response.message === "user") {
                            $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                            $("#navLogs").attr("style", "display: none !important;");
                        }
                    })
                })
            }
            //sort clothing by name z to a
            else if ((sort === "z to a") && (filter === "")) {
                //ajaxcall: get product listing from database and display in page
                var settings = {
                    "url": "http://localhost:5000/clothing/getClothingByNameZToA",
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage["jwt"]
                    },
                };
                $.ajax(settings).done(function (response) {
                    $("#listingTable>tbody").html("")
                    // Handle the response data
                    clothingList = response.clothing
                    $.each(clothingList, function (i) {
                        var oneClothing = Object.values(clothingList)[i]
                        var clothingID = oneClothing["clothingID"]
                        var name = oneClothing["name"]
                        var description = oneClothing["description"]
                        var image_url = "../../server/" + oneClothing["image_url"]
                        var categoryName = oneClothing["categoryName"]
                        var price = oneClothing["price"]
                        var quantity = oneClothing["quantity"]
                        $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                    <!--edit btn-->
                    <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                    <!--delete btn-->
                    <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                        )
                        //search bar (without on click search btn)
                        //make search input lowercase to match with text in td cell
                        var searchVal = $("#searchInput").val().toLowerCase();
                        $("#listingTable>tbody tr").each(function () {
                            //find the text of the first td cell (name of product) in each tr and make it lowercase
                            var cellVal = $(this).find("td:first").text().toLowerCase();
                            if (cellVal.indexOf(searchVal) !== -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                        //if role in localStorage is user, hide delete and edit buttons
                        if (response.message === "user") {
                            $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                            $("#navLogs").attr("style", "display: none !important;");
                        }
                    })
                })
            }
            else if ((sort === "low to high") && (filter !== "")) {
                var data = {
                    "categoryName": filter
                };
                var settings = {
                    "url": "http://localhost:5000/clothing/getClothingByPriceLowToHighAndCategory",
                    "method": "GET",
                    "timeout": 0,
                    "data": data,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage["jwt"]
                    },
                };
                //validation for whether email is in database
                // Perform an AJAX GET request
                $.ajax(settings).done(function (response) {
                    $("#listingTable>tbody").html("")
                    // Handle the response data
                    clothingList = response.clothing
                    $.each(clothingList, function (i) {
                        var oneClothing = Object.values(clothingList)[i]
                        var clothingID = oneClothing["clothingID"]
                        var name = oneClothing["name"]
                        var description = oneClothing["description"]
                        var image_url = "../../server/" + oneClothing["image_url"]
                        var categoryName = oneClothing["categoryName"]
                        var price = oneClothing["price"]
                        var quantity = oneClothing["quantity"]
                        $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                    <!--edit btn-->
                    <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                    <!--delete btn-->
                    <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                        )
                        //search bar (without on click search btn)
                        //make search input lowercase to match with text in td cell
                        var searchVal = $("#searchInput").val().toLowerCase();
                        $("#listingTable>tbody tr").each(function () {
                            //find the text of the first td cell (name of product) in each tr and make it lowercase
                            var cellVal = $(this).find("td:first").text().toLowerCase();
                            if (cellVal.indexOf(searchVal) !== -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                        //if role in localStorage is user, hide delete and edit buttons
                        if (response.message === "user") {
                            $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                            $("#navLogs").attr("style", "display: none !important;");
                        }
                    })
                })
            }
            else if ((sort === "high to low") && (filter !== "")) {
                var data = {
                    "categoryName": filter
                };
                var settings = {
                    "url": "http://localhost:5000/clothing/getClothingByPriceHighToLowAndCategory",
                    "method": "GET",
                    "timeout": 0,
                    "data": data,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage["jwt"]
                    },
                };
                //validation for whether email is in database
                // Perform an AJAX GET request
                $.ajax(settings).done(function (response) {
                    $("#listingTable>tbody").html("")
                    // Handle the response data
                    clothingList = response.clothing
                    $.each(clothingList, function (i) {
                        var oneClothing = Object.values(clothingList)[i]
                        var clothingID = oneClothing["clothingID"]
                        var name = oneClothing["name"]
                        var description = oneClothing["description"]
                        var image_url = "../../server/" + oneClothing["image_url"]
                        var categoryName = oneClothing["categoryName"]
                        var price = oneClothing["price"]
                        var quantity = oneClothing["quantity"]
                        $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                    <!--edit btn-->
                    <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                    <!--delete btn-->
                    <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                        )
                        //search bar (without on click search btn)
                        //make search input lowercase to match with text in td cell
                        var searchVal = $("#searchInput").val().toLowerCase();
                        $("#listingTable>tbody tr").each(function () {
                            //find the text of the first td cell (name of product) in each tr and make it lowercase
                            var cellVal = $(this).find("td:first").text().toLowerCase();
                            if (cellVal.indexOf(searchVal) !== -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                        //if role in localStorage is user, hide delete and edit buttons
                        if (response.message === "user") {
                            $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                            $("#navLogs").attr("style", "display: none !important;");
                        }
                    })
                })
            }
            else if ((sort === "a to z") && (filter !== "")) {
                var data = {
                    "categoryName": filter
                };
                var settings = {
                    "url": "http://localhost:5000/clothing/getClothingByNameAToZAndCategory",
                    "method": "GET",
                    "timeout": 0,
                    "data": data,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage["jwt"]
                    },
                };
                //validation for whether email is in database
                // Perform an AJAX GET request
                $.ajax(settings).done(function (response) {
                    $("#listingTable>tbody").html("")
                    // Handle the response data
                    clothingList = response.clothing
                    $.each(clothingList, function (i) {
                        var oneClothing = Object.values(clothingList)[i]
                        var clothingID = oneClothing["clothingID"]
                        var name = oneClothing["name"]
                        var description = oneClothing["description"]
                        var image_url = "../../server/" + oneClothing["image_url"]
                        var categoryName = oneClothing["categoryName"]
                        var price = oneClothing["price"]
                        var quantity = oneClothing["quantity"]
                        $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                    <!--edit btn-->
                    <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                    <!--delete btn-->
                    <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                        )
                        //search bar (without on click search btn)
                        //make search input lowercase to match with text in td cell
                        var searchVal = $("#searchInput").val().toLowerCase();
                        $("#listingTable>tbody tr").each(function () {
                            //find the text of the first td cell (name of product) in each tr and make it lowercase
                            var cellVal = $(this).find("td:first").text().toLowerCase();
                            if (cellVal.indexOf(searchVal) !== -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                        //if role in localStorage is user, hide delete and edit buttons
                        if (response.message === "user") {
                            $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                            $("#navLogs").attr("style", "display: none !important;");
                        }
                    })
                })
            }
            else if ((sort === "z to a") && (filter !== "")) {
                var data = {
                    "categoryName": filter
                };
                var settings = {
                    "url": "http://localhost:5000/clothing/getClothingByNameZToAAndCategory",
                    "method": "GET",
                    "timeout": 0,
                    "data": data,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage["jwt"]
                    },
                };
                //validation for whether email is in database
                // Perform an AJAX GET request
                $.ajax(settings).done(function (response) {
                    $("#listingTable>tbody").html("")
                    // Handle the response data
                    clothingList = response.clothing
                    $.each(clothingList, function (i) {
                        var oneClothing = Object.values(clothingList)[i]
                        var clothingID = oneClothing["clothingID"]
                        var name = oneClothing["name"]
                        var description = oneClothing["description"]
                        var image_url = "../../server/" + oneClothing["image_url"]
                        var categoryName = oneClothing["categoryName"]
                        var price = oneClothing["price"]
                        var quantity = oneClothing["quantity"]
                        $("#listingTable>tbody").append(`
                <tr>
                    <td class="text-left pl-4 align-middle">${name}</td>
                    <td class="text-left align-middle"><img src="${image_url}"
                        class="productImg">
                    </td>
                    <td class="text-center align-middle">${clothingID}</td>
                    <td class="text-center align-middle">${categoryName}</td>
                    <td class="text-left align-middle">${description}</td>
                    <td class="text-center align-middle">${quantity}</td>
                    <td class="text-center align-middle">$${price}</td>
                    <td class="text-center justify-items-end align-middle actions">
                        <!--edit btn-->
                        <a href="../edit/edit_listing.html" id="editBtn"><i class="fa-regular fa-pen-to-square text-danger"></i></a> &nbsp;
                        <!--delete btn-->
                        <a href="#" id="deleteBtn"><i class="fa-sharp fa-regular fa-trash text-danger"></i></a>
                    </td>
                </tr>`
                        )
                        //search bar (without on click search btn)
                        //make search input lowercase to match with text in td cell
                        var searchVal = $("#searchInput").val().toLowerCase();
                        $("#listingTable>tbody tr").each(function () {
                            //find the text of the first td cell (name of product) in each tr and make it lowercase
                            var cellVal = $(this).find("td:first").text().toLowerCase();
                            if (cellVal.indexOf(searchVal) !== -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        })
                        //if role in localStorage is user, hide delete and edit buttons
                        if (response.message === "user") {
                            $("td.text-center.justify-items-end.align-middle.actions").attr("style", "display: none !important;");
                            $("#navLogs").attr("style", "display: none !important;");
                        }
                    })
                })
            }
        })

        //search bar
        //on click of search btn
        $("#searchBtn").on("click", function (event) {
            //prevent submit btn event
            event.preventDefault()
            //make search input lowercase to match with text in td cell
            var searchVal = $("#searchInput").val().toLowerCase();
            $("#listingTable>tbody tr").each(function () {
                //find the text of the first td cell (name of product) in each tr and make it lowercase
                var cellVal = $(this).find("td:first").text().toLowerCase();
                if (cellVal.indexOf(searchVal) !== -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            })
        })

        //find clothingID of selected tr to be edited
        $(document).on("click", "#editBtn", function (event) {
            event.preventDefault()
            var tr = $(this).closest('tr');
            var selectedTr = tr.find("td:nth-child(3)").text();
            localStorage['clothingID'] = selectedTr;
            window.location.href = "../edit/edit_listing.html"
        });

        //find clothingID of selected tr to be deleted
        //pop up response once delete btn is clicked and ajax call to delete
        $(document).on("click", "#deleteBtn", function (event) {
            event.preventDefault()
            var tr = $(this).closest('tr');
            //selected tr's clothingID
            var selectedTr = tr.find("td:nth-child(3)").text();
            //selected tr's product name
            var name = tr.find("td:first-child").text()
            //popup of delete confirmation
            $("#messageTitle").text(`Confirm deletion of ${name}?`)
            $("div.dialog").addClass("dialogAppear")
            $("div.popup-background").addClass("visible")

            //on click of cancel button
            $("#cancelBtn").on("click", function () {
                $("div.dialog").removeClass("dialogAppear")
                $("div.popup-background").removeClass("visible")
            })

            //delete upon clicking remove btn
            $("#removeBtn").on("click", function () {
                var settings = {
                    "url": "http://localhost:5000/clothing/delete",
                    "method": "DELETE",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    "data": JSON.stringify({
                        "clothingID": selectedTr,
                        "name": localStorage.getItem("name")
                    }),
                };
                $.ajax(settings).done(function (response) {
                    if (response.message) {
                        //popup of delete response
                        $("#messageTitle").text(`${name} Deleted!`)
                        $("#goBackBtn").addClass("goBackBtnAppear")
                        $("#removeBtn,#cancelBtn").addClass("BtnDisappear")

                        //on click of go back button
                        $("#goBackBtn").on("click", function () {
                            $("div.dialog").removeClass("dialogAppear")
                            $("div.popup-background").removeClass("visible")
                            window.location.href = "products.html"
                        })
                    }
                });
            })
        });

        //logout: get rid of localStorage
        $("#logout").on("click", function () {
            delete localStorage["jwt"];
            delete localStorage["role"];
            delete localStorage["clothingID"];
            delete localStorage["name"];
            location.href = "../login/login.html";
        })

    }



})



