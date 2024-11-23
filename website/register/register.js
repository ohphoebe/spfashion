$(function () {
    //different images for different screen sizes
    var width = $(window).width();
    if (width >= 1700) {
        $("#headerImg").html('<img src="../../server/images/headerImg2.jpg" class="w-100" alt="sp fashion">')
    } else if (width >= 960) {
        $("#headerImg").html('<img src="../../server/images/headerImg.jpg" class="w-100" alt="sp fashion">')
    } else if (width >= 540) {
        $("#headerImg").html('<img src="../../server/images/index1.jpg" class="w-100" alt="sp fashion">')
    }

    //when click on label, arrow is disabled from rotating
    var filterByTxt = $('span#roleSpan');
    filterByTxt.on("click", function (e) {
        $("#filterDropdown").removeClass("rotate");
    });

    //rotate arrow when open select menu
    $("#roleSelect").on("click", function () {
        $(".custom-select").toggleClass("rotate")
    })

    //detect click outside select box to revert arrow back to original rotation
    $(document).on("click", function (e) {
        var obj = $("#roleSelect");
        if (!$(e.target).closest(obj).length) {
            $(".custom-select").removeClass("rotate");
        }
    });

    //default values for error msg and background
    var emailValue = $("input#email").val();
    var nameValue = $("input#name").val();
    var roleValue = $("select#roleSelect").val();
    var passwordValue = $("input#password").val();
    var emailErrorMsg = $("div#emailError");
    var nameErrorMsg = $("div#nameError");
    var roleErrorMsg = $("div#roleError");
    var passwordErrorMsg = $("div#passwordError");
    roleErrorMsg.html('<span class="w-75"></span>')
    nameErrorMsg.html('<span class="w-75"></span>')
    emailErrorMsg.html('<span class="w-75"></span>')
    passwordErrorMsg.html('<span class="w-75"></span>')
    $("input#name").css("background", "")
    $("input#role").css("background", "")
    $("input#email").css("background", "")
    $("input#password").css("background", "")

    //VALIDATION FOR EMAIL VALUES
    //upon input of email, check whether email already registered
    $("input#email").on("input", function () {
        //default values for error msg and background
        var emailErrorMsg = $("div#emailError");
        emailErrorMsg.html('<span class="w-75"></span>')

        $("input#email").css("background", "")

        $('#registerBtn').prop('disabled', false)
        var emailValue = $(this).val();
        var emailErrorMsg = $("div#emailError");
        var data = {
            "email": emailValue
        };
        //validation for whether email is in database
        // Perform an AJAX GET request
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5000/users/email',
            contentType: 'application/json',
            data: data,
            success: function () {
                emailErrorMsg.html('<span class="w-75"></span>')
                $("input#email").css("background", "")
            },
            error: function (xhr, status, error) {
                if (xhr.status === 409) {
                    var data = xhr.responseText;
                    var jsonResponse = JSON.parse(data);
                    console.log(jsonResponse)
                    emailErrorMsg.html('<span class="w-75">Email already registered</span>')
                    $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
                    $('#registerBtn').prop('disabled', true)
                }
                if (xhr.status === 500) {
                    // Server error (status code 500)
                    console.log('Error: ' + xhr.responseText);
                }
            }
        })
    })

    //upon register btn click
    $("#registerBtn").on("click", function (event) {
        var validation = true;

        //VALIDATION FOR EMAIL VALUES
        //check whether email is email value
        var emailValue = $("input#email").val();
        var nameValue = $("input#name").val();
        var roleValue = $("select#roleSelect").val();
        var passwordValue = $("input#password").val();
        var emailErrorMsg = $("div#emailError");
        var nameErrorMsg = $("div#nameError");
        var roleErrorMsg = $("div#roleError");
        var passwordErrorMsg = $("div#passwordError");

        //default values for error msg and background
        emailErrorMsg.html('<span class="w-75"></span>')
        passwordErrorMsg.html('<span class="w-75"></span>')
        nameErrorMsg.html('<span class="w-75"></span>')
        roleErrorMsg.html('<span class="w-75"></span>')
        $("input#email").css("background", "")
        $("input#password").css("background", "")
        $("input#role").css("background", "")
        $("input#name").css("background", "")

        var regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //email failed regexp
        if (!regex.test(emailValue)) {
            validation = false;
            emailErrorMsg.html('<span class="w-75">Enter a valid email</span>')
            $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
        }
        //email is empty string
        if (emailValue == "") {
            validation = false;
            emailErrorMsg.html('<span class="w-75">Enter an email</span>')
            $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
        }
        //email only contains whitespace
        if (!emailValue.trim()) {
            validation = false;
            emailErrorMsg.html('<span class="w-75">Enter a valid email</span>')
            $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
        }

        //VALIDATION FOR NAME VALUES
        //name is empty string
        if (nameValue == "") {
            validation = false;
            nameErrorMsg.html('<span class="w-75">Enter a name</span>')
            $("input#name").css("background", "url('../../server/images/alert.svg') no-repeat right")
        }
        //name only contains whitespace
        if (!nameValue.trim()) {
            validation = false;
            nameErrorMsg.html('<span class="w-75">Enter a name</span>')
            $("input#name").css("background", "url('../../server/images/alert.svg') no-repeat right")
        }


        //VALIDATION FOR ROLE VALUES
        //role is "Select a role"
        if (roleValue == "Select a role") {
            validation = false;
            roleErrorMsg.html('<span class="w-75">Select a role</span>')
        }
        //password only contains whitespace
        if (!passwordValue.trim()) {
            validation = false;
            passwordErrorMsg.html('<span class="w-75">Enter a password</span>')
            $("input#password").css("background", "url('../../server/images/alert.svg') no-repeat right")
        }

        //VALIDATION FOR PASSWORD VALUES
        //password is empty string
        if (passwordValue == "") {
            validation = false;
            passwordErrorMsg.html('<span class="w-75">Enter a password</span>')
            $("input#password").css("background", "url('../../server/images/alert.svg') no-repeat right")
        }
        //password only contains whitespace
        if (!passwordValue.trim()) {
            validation = false;
            passwordErrorMsg.html('<span class="w-75">Enter a password</span>')
            $("input#password").css("background", "url('../../server/images/alert.svg') no-repeat right")
        }

        if (validation === false) {
            event.preventDefault()
        } else {
            //create new user once values are validated
            $.ajax({
                url: 'http://localhost:5000/users/register',
                type: 'POST',
                data: JSON.stringify({ email: emailValue, name: nameValue, role: roleValue, password: passwordValue }),
                contentType: 'application/json',
                success: function (response) {
                    if (response.message === "1 user(s) are inserted") {
                        $("div.dialog").addClass("dialogAppear")
                        $("div.popup-background").addClass("visible")
                        $("#loginBtn").on("click", function () {
                            window.location.href = "../login/login.html"
                        })
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 422) {
                        var data = xhr.responseText;
                        var jsonResponse = JSON.parse(data);
                        if (jsonResponse["message"] === "invalid email") {
                            emailErrorMsg.html('<span class="w-75">Enter a valid email</span>')
                            $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
                        }
                        if (jsonResponse["message"] === "select a role") {
                            roleErrorMsg.html('<span class="w-75">Select a role</span>')
                        }
                        if (jsonResponse["message"] === "enter a password") {
                            passwordErrorMsg.html('<span class="w-75">Enter a password</span>')
                        }
                    }
                    if (xhr.status === 500) {
                        // Resource not found (status code 404)
                        console.log('Error: ' + xhr.responseText);
                    }
                }
            });
        }

    })

    //upon click of "enter" key
    $('#email,#password,#role,#name').keypress(function (event) {
        var validation = true;

        //VALIDATION FOR EMAIL VALUES
        //check whether email is email value
        var emailValue = $("input#email").val();
        var nameValue = $("input#name").val();
        var roleValue = $("select#roleSelect").val();
        var passwordValue = $("input#password").val();
        var emailErrorMsg = $("div#emailError");
        var nameErrorMsg = $("div#nameError");
        var roleErrorMsg = $("div#roleError");
        var passwordErrorMsg = $("div#passwordError");

        //default values for error msg and background
        emailErrorMsg.html('<span class="w-75"></span>')
        passwordErrorMsg.html('<span class="w-75"></span>')
        nameErrorMsg.html('<span class="w-75"></span>')
        roleErrorMsg.html('<span class="w-75"></span>')
        $("input#email").css("background", "")
        $("input#password").css("background", "")
        $("input#role").css("background", "")
        $("input#name").css("background", "")

        var regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //check values upon user entering "ENTER"
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            event.preventDefault();
            //email failed regexp
            if (!regex.test(emailValue)) {
                validation = false;
                emailErrorMsg.html('<span class="w-75">Enter a valid email</span>')
                $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
            }
            //email is empty string
            if (emailValue == "") {
                validation = false;
                emailErrorMsg.html('<span class="w-75">Enter an email</span>')
                $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
            }
            //email only contains whitespace
            if (!emailValue.trim()) {
                validation = false;
                emailErrorMsg.html('<span class="w-75">Enter a valid email</span>')
                $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
            }

            //VALIDATION FOR NAME VALUES
            //name is empty string
            if (nameValue == "") {
                validation = false;
                nameErrorMsg.html('<span class="w-75">Enter a name</span>')
                $("input#name").css("background", "url('../../server/images/alert.svg') no-repeat right")
            }
            //name only contains whitespace
            if (!nameValue.trim()) {
                validation = false;
                nameErrorMsg.html('<span class="w-75">Enter a name</span>')
                $("input#name").css("background", "url('../../server/images/alert.svg') no-repeat right")
            }


            //VALIDATION FOR ROLE VALUES
            //role is "Select a role"
            if (roleValue == "Select a role") {
                validation = false;
                roleErrorMsg.html('<span class="w-75">Select a role</span>')
            }
            //password only contains whitespace
            if (!passwordValue.trim()) {
                validation = false;
                passwordErrorMsg.html('<span class="w-75">Enter a password</span>')
                $("input#password").css("background", "url('../../server/images/alert.svg') no-repeat right")
            }

            //VALIDATION FOR PASSWORD VALUES
            //password is empty string
            if (passwordValue == "") {
                validation = false;
                passwordErrorMsg.html('<span class="w-75">Enter a password</span>')
                $("input#password").css("background", "url('../../server/images/alert.svg') no-repeat right")
            }
            //password only contains whitespace
            if (!passwordValue.trim()) {
                validation = false;
                passwordErrorMsg.html('<span class="w-75">Enter a password</span>')
                $("input#password").css("background", "url('../../server/images/alert.svg') no-repeat right")
            }

            if (validation === false) {
                // event.preventDefault()
            } else {
                //create new user once values are validated
                $.ajax({
                    url: 'http://localhost:5000/users/register',
                    type: 'POST',
                    data: JSON.stringify({ email: emailValue, name: nameValue, role: roleValue, password: passwordValue }),
                    contentType: 'application/json',
                    success: function (response) {
                        if (response.message === "1 user(s) are inserted") {
                            $("div.dialog").addClass("dialogAppear")
                            $("div.popup-background").addClass("visible")
                            $("#loginBtn").on("click", function () {
                                window.location.href = "../login/login.html"
                            })
                        }
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status === 422) {
                            var data = xhr.responseText;
                            var jsonResponse = JSON.parse(data);
                            if (jsonResponse["message"] === "invalid email") {
                                emailErrorMsg.html('<span class="w-75">Enter a valid email</span>')
                                $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
                            }
                            if (jsonResponse["message"] === "select a role") {
                                roleErrorMsg.html('<span class="w-75">Select a role</span>')
                            }
                            if (jsonResponse["message"] === "enter a password") {
                                passwordErrorMsg.html('<span class="w-75">Enter a password</span>')
                            }
                        }
                        if (xhr.status === 500) {
                            // Resource not found (status code 404)
                            console.log('Error: ' + xhr.responseText);
                        }
                    }
                });
            }
        }

    })
});
