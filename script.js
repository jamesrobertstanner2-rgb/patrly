/* =========================================
   PATRLY WEBSITE JAVASCRIPT
========================================= */


/* DISCORD */

function joinDiscord() {

    window.open(
        "https://discord.gg/eWQr8HRr5W",
        "_blank"
    );

}


/* =========================================
   MODALS
========================================= */

function openSignup() {

    const modal = document.getElementById("modal");

    document.getElementById("modalTitle").textContent =
        "Get Started";

    document.getElementById("modalText").textContent =
        "Join the Patrly Discord to get started with the platform.";

    modal.classList.add("show");

}


function openLogin() {

    const modal = document.getElementById("modal");

    document.getElementById("modalTitle").textContent =
        "Patrly Login";

    document.getElementById("modalText").textContent =
        "Patrly accounts and dashboard access will be available here.";

    modal.classList.add("show");

}


function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

}


/* Close modal when clicking outside */

document
    .getElementById("modal")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeModal();
        }

    });


/* =========================================
   FEATURES
========================================= */

function openFeature(feature) {

    const modal = document.getElementById("modal");

    document.getElementById("modalTitle").textContent =
        feature;

    document.getElementById("modalText").textContent =
        feature + " is part of the Patrly platform. Join the Discord to learn more.";

    modal.classList.add("show");

}


/* =========================================
   DASHBOARD
========================================= */

function dashboardPage(page) {

    document.getElementById("dashboardTitle").textContent =
        page;

    const buttons =
        document.querySelectorAll(".side-item");

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    event.currentTarget.classList.add("active");

}


/* =========================================
   REPORTS
========================================= */

function createReport() {

    alert(
        "Report creation will be connected to the Patrly platform here."
    );

}


function viewReports() {

    alert(
        "The full reports page will open here."
    );

}


/* =========================================
   SMOOTH SCROLLING
========================================= */

function scrollToSection(id) {

    const section =
        document.getElementById(id);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

    const links =
        document.querySelector(".nav-links");

    if (links.style.display === "flex") {

        links.style.display = "none";

    } else {

        links.style.display = "flex";

        links.style.position = "absolute";

        links.style.top = "75px";

        links.style.left = "0";

        links.style.width = "100%";

        links.style.padding = "20px";

        links.style.flexDirection = "column";

        links.style.background = "#08080d";

        links.style.borderBottom =
            "1px solid rgba(255,255,255,0.06)";

    }

}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closeModal();
        }

    }
)
function loginWithDiscord() {
    window.location.href = "/api/auth/discord";
}