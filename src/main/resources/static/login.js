document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);

    const errorMessage = document.getElementById("errorMessage");

    const logoutMessage = document.getElementById("logoutMessage");


    // =====================================================
    // SHOW LOGIN ERROR
    // =====================================================

    if (urlParams.get("error") === "true") {

        if (errorMessage) {
            errorMessage.style.display = "block";
        }

    }


    // =====================================================
    // SHOW LOGOUT MESSAGE
    // =====================================================

    if (urlParams.get("logout") === "true") {

        if (logoutMessage) {
            logoutMessage.style.display = "block";
        }

    }

});