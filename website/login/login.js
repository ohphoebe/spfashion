$(function () {
    //different images for different screen sizes
    var width = $(window).width();
    if (width >= 1700) {
        $("#headerImg").html('<img src="../../server/images/headerImg2.jpg" class="w-100" alt="sp fashion">')
    } else if (width >= 960) {
        $("#headerImg").html('<img src="../../server/images/index4.jpg" class="w-100" alt="sp fashion">')
    } else if (width >= 540) {
        $("#headerImg").html('<img src="../../server/images/index1.jpg" class="w-100" alt="sp fashion">')
    }

    //upon login btn click
    $("#loginBtn").on("click", function (event) {
        event.preventDefault();

        var emailValue = $("input#email").val();
        var passwordValue = $("input#password").val();
        var emailErrorMsg = $("div#emailError");
        var passwordErrorMsg = $("div#passwordError");

        //VALIDATION FOR EMAIL VALUES
        var validation = true;
        var data = {
            "email": emailValue,
            "password": passwordValue
        };

        //default value for error msg
        emailErrorMsg.html('')
        passwordErrorMsg.html('')
        $("input#email").css("background", "")
        $("input#password").css("background", "")

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
            event.preventDefault();
        } else {
            // Perform an AJAX POST request, JWT token
            // Make the POST request using jQuery
            $.ajax({
                type: 'POST',
                url: 'http://localhost:5000/users/login',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (response) {
                    // Store the token in the localStorage
                    if (response.jwt) {
                        localStorage['jwt'] = response.jwt;
                        localStorage['role'] = response.role["role"];
                        localStorage['name'] = response.name["name"];
                    }
                    window.location.href = "../products/products.html"
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 401) {
                        var data = xhr.responseText;
                        var jsonResponse = JSON.parse(data);
                        if (jsonResponse["message"] === "Invalid email") {
                            emailErrorMsg.html('<span class="w-75">Enter a valid email</span>')
                            $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
                        }
                        if (jsonResponse["message"] === "Invalid password") {
                            passwordErrorMsg.html('<span class="w-75">Enter a valid password</span>')
                            $("input#password").css("background", "url('../../server/images/alert.svg') no-repeat right")
                        }
                    }
                    if (xhr.status === 500) {
                        // Server error (status code 500)
                        console.log('Error: ' + xhr.responseText);
                    }
                }
            })
        }

    })

    //upon click of "enter" key
    $('#email,#password').keypress(function (event) {
        //default values for error msg and background
        var emailValue = $("input#email").val();
        var passwordValue = $("input#password").val();
        var emailErrorMsg = $("div#emailError");
        var passwordErrorMsg = $("div#passwordError");

        //check values upon user entering "ENTER"
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            event.preventDefault();
            var validation = true;
            //VALIDATION FOR EMAIL VALUES
            var data = {
                "email": emailValue,
                "password": passwordValue
            };

            //default value for error msg
            emailErrorMsg.html('')
            passwordErrorMsg.html('')
            $("input#email").css("background", "")
            $("input#password").css("background", "")

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
                // Perform an AJAX POST request, JWT token
                // Make the POST request using jQuery
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:5000/users/login',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (response) {
                        // Store the token in the localStorage
                        if (response.jwt) {
                            localStorage['jwt'] = response.jwt;
                            localStorage['role'] = response.role["role"];
                        }
                        window.location.href = "../products/products.html"
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status === 401) {
                            var data = xhr.responseText;
                            var jsonResponse = JSON.parse(data);
                            if (jsonResponse["message"] === "Invalid email") {
                                emailErrorMsg.html('<span class="w-75">Enter a valid email</span>')
                                $("input#email").css("background", "url('../../server/images/alert.svg') no-repeat right")
                            }
                            if (jsonResponse["message"] === "Invalid password") {
                                passwordErrorMsg.html('<span class="w-75">Enter a valid password</span>')
                                $("input#password").css("background", "url('../../server/images/alert.svg') no-repeat right")
                            }
                        }
                        if (xhr.status === 500) {
                            // Resource not found (status code 404)
                            console.log('Error: ' + xhr.responseText);
                        }
                    }
                })
            }

        }

    });


});
