// =====================================================
// STUDENT MANAGEMENT SYSTEM
// REGISTRATION JAVASCRIPT
// =====================================================

const API_URL = "/students";


// =====================================================
// GET FORM
// =====================================================

const studentForm = document.getElementById("studentForm");


// =====================================================
// FORM SUBMISSION
// =====================================================

if (studentForm) {

    studentForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // =================================================
        // GET BASIC INFORMATION
        // =================================================

        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phoneNumber =
            document.getElementById("phoneNumber").value.trim();

        const registrationNumber =
            document.getElementById("registrationNumber").value.trim();


        // =================================================
        // GET ADDITIONAL INFORMATION
        // =================================================

        const gender =
            document.getElementById("gender").value;

        const dateOfBirth =
            document.getElementById("dateOfBirth").value;

        const faculty =
            document.getElementById("faculty").value.trim();

        const department =
            document.getElementById("department").value.trim();

        const level =
            document.getElementById("level").value;

        const session =
            document.getElementById("session").value;

        const address =
            document.getElementById("address").value.trim();

        const guardianName =
            document.getElementById("guardianName").value.trim();

        const guardianPhone =
            document.getElementById("guardianPhone").value.trim();


        // =================================================
        // REQUIRED FIELD VALIDATION
        // =================================================

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phoneNumber ||
            !registrationNumber
        ) {

            showMessage(
                "Please fill in all required fields.",
                "error"
            );

            return;
        }


        // =================================================
        // NAME VALIDATION
        // =================================================

        const namePattern = /^[A-Za-zÀ-ÿ\s'-]+$/;

        if (!namePattern.test(firstName)) {

            showMessage(
                "First name contains invalid characters.",
                "error"
            );

            return;
        }

        if (!namePattern.test(lastName)) {

            showMessage(
                "Last name contains invalid characters.",
                "error"
            );

            return;
        }


        // =================================================
        // EMAIL VALIDATION
        // =================================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        // =================================================
        // PHONE VALIDATION
        // =================================================

        const phonePattern =
            /^[0-9+\-\s]{7,15}$/;

        if (!phonePattern.test(phoneNumber)) {

            showMessage(
                "Please enter a valid phone number.",
                "error"
            );

            return;
        }


        // =================================================
        // GUARDIAN PHONE VALIDATION
        // =================================================

        if (guardianPhone) {

            if (!phonePattern.test(guardianPhone)) {

                showMessage(
                    "Please enter a valid guardian phone number.",
                    "error"
                );

                return;
            }
        }


        // =================================================
        // REGISTRATION NUMBER VALIDATION
        // =================================================

        if (registrationNumber.length < 3) {

            showMessage(
                "Registration number is too short.",
                "error"
            );

            return;
        }


        // =================================================
        // STUDENT OBJECT
        // =================================================

        const student = {

            firstName: firstName,

            lastName: lastName,

            email: email,

            phoneNumber: phoneNumber,

            registrationNumber: registrationNumber,

            gender: gender || null,

            dateOfBirth: dateOfBirth || null,

            faculty: faculty || null,

            department: department || null,

            level: level || null,

            session: session || null,

            address: address || null,

            guardianName: guardianName || null,

            guardianPhone: guardianPhone || null

        };


        console.log(
            "Student being submitted:",
            student
        );


        // =================================================
        // REGISTER BUTTON
        // =================================================

        const registerButton =
            document.querySelector(".register-button");


        if (registerButton) {

            registerButton.disabled = true;

            registerButton.textContent =
                "Registering...";

        }


        // =================================================
        // SEND DATA TO SPRING BOOT
        // =================================================

        try {

            const response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(student)

                    }
                );


            console.log(
                "Registration response:",
                response.status
            );


            // =================================================
            // SUCCESS
            // =================================================

            if (response.ok) {

                let savedStudent = null;

                try {

                    savedStudent =
                        await response.json();

                } catch (error) {

                    console.log(
                        "Server returned no JSON response."
                    );

                }


                console.log(
                    "Student registered successfully:",
                    savedStudent
                );


                showMessage(
                    "Student registered successfully!",
                    "success"
                );


                studentForm.reset();


                if (registerButton) {

                    registerButton.disabled = true;

                    registerButton.textContent =
                        "Registered ✓";

                }


                // =================================================
                // GO TO DASHBOARD
                // =================================================

                setTimeout(function () {

                    window.location.href =
                        "students.html";

                }, 1200);


                return;

            }


            // =================================================
            // SERVER ERROR
            // =================================================

            let errorMessage =
                "Failed to register student.";


            const contentType =
                response.headers.get("content-type");


            try {

                if (
                    contentType &&
                    contentType.includes("application/json")
                ) {

                    const errorData =
                        await response.json();


                    if (errorData.message) {

                        errorMessage =
                            errorData.message;

                    } else if (errorData.error) {

                        errorMessage =
                            errorData.error;

                    }

                } else {

                    const errorText =
                        await response.text();


                    if (errorText) {

                        errorMessage =
                            errorText;

                    }

                }

            } catch (error) {

                console.error(
                    "Could not read server error:",
                    error
                );

            }


            console.error(
                "Server returned:",
                response.status,
                errorMessage
            );


            showMessage(
                errorMessage,
                "error"
            );


            if (registerButton) {

                registerButton.disabled = false;

                registerButton.textContent =
                    "Register Student";

            }

        } catch (error) {

            // =================================================
            // CONNECTION ERROR
            // =================================================

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                "Could not connect to the server. Make sure Spring Boot is running.",
                "error"
            );


            if (registerButton) {

                registerButton.disabled = false;

                registerButton.textContent =
                    "Register Student";

            }

        }

    });

}


// =====================================================
// SHOW MESSAGE
// =====================================================

function showMessage(text, type) {

    const message =
        document.getElementById("message");


    if (!message) {
        return;
    }


    message.textContent =
        text;


    if (type === "success") {

        message.style.color =
            "#16a34a";

        message.style.background =
            "#f0fdf4";

        message.style.border =
            "1px solid #bbf7d0";

    } else {

        message.style.color =
            "#dc2626";

        message.style.background =
            "#fef2f2";

        message.style.border =
            "1px solid #fecaca";

    }


    message.style.padding =
        "12px";

    message.style.borderRadius =
        "7px";

    message.style.marginTop =
        "15px";

    message.style.textAlign =
        "center";

    message.style.fontSize =
        "13px";

    message.style.fontWeight =
        "600";

}


// =====================================================
// CLEAR MESSAGE
// =====================================================

function clearMessage() {

    const message =
        document.getElementById("message");


    if (!message) {
        return;
    }


    message.textContent =
        "";

    message.style.background =
        "transparent";

    message.style.border =
        "none";

    message.style.padding =
        "0";

}


// =====================================================
// CLEAR MESSAGE WHEN USER TYPES
// =====================================================

const inputs =
    document.querySelectorAll(
        "#studentForm input, #studentForm select, #studentForm textarea"
    );


inputs.forEach(function (input) {

    input.addEventListener(
        "input",
        function () {

            clearMessage();

        }
    );


    input.addEventListener(
        "change",
        function () {

            clearMessage();

        }
    );

});


// =====================================================
// CLEAR FORM BUTTON
// =====================================================

if (studentForm) {

    studentForm.addEventListener(
        "reset",
        function () {

            setTimeout(function () {

                clearMessage();


                const registerButton =
                    document.querySelector(
                        ".register-button"
                    );


                if (registerButton) {

                    registerButton.disabled =
                        false;

                    registerButton.textContent =
                        "Register Student";

                }

            }, 0);

        }
    );

}