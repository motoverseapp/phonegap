/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', function() {
    Keyboard.shrinkView(true)
    window.addEventListener('keyboardDidShow', function () {
      document.activeElement.scrollIntoView()
    })
    // Your Cordova-specific code here
}, false);


function adduser() {
    alert("Test DONE");

    // Fetch the CSRF token from your Django server
    function fetchCSRFToken() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: "https://motoverse.app/get_csrf_token/",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    const csrfToken = data.csrf_token;
                    resolve(csrfToken);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }

    // Function to send the POST request with the CSRF token
    function sendPostRequest(csrfToken) {
        // Collect form data
        const formData = {
            username: $("#username").val(),
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            csrfmiddlewaretoken: csrfToken // Include the CSRF token in the post body
        };

        // Send the form data as a JSON string in the post body
        const jsonData = JSON.stringify(formData);

        // Send the JSON data to a REST API endpoint using AJAX
        $.ajax({
            url: "https://motoverse.app/add_user/",
            type: "POST",
            contentType: "application/json",
            headers: {
                "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
                'Origin': 'http://localhost:8000',
            },
            data: jsonData,
            success: function (data) {
                // Handle the response from the API
                console.log("Response from API:", data);
                // You can display a success message or redirect the user after successful registration
            },
            error: function (error) {
                console.error("Error:", error);
                // Handle any errors that occur during the request
            }
        });
    }

    // Fetch the CSRF token and then send the POST request
    fetchCSRFToken()
        .then(function (csrfToken) {
            sendPostRequest(csrfToken);
        })
        .catch(function (error) {
            console.error("Error fetching CSRF token:", error);
        });

    return false;
}
