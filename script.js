// ================================
// PATRLY WEBSITE BUTTONS
// ================================

// Login with Discord
function loginWithDiscord() {
    window.location.href = "/api/auth/discord";
}

// Get Started
function openSignup() {
    window.location.href = "/api/auth/discord";
}

// Join Discord
function joinDiscord() {
    window.open(
        "https://discord.gg/eWQr8HRr5W",
        "_blank"
    );
}

// Navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// Feature buttons
function openFeature(feature) {
    alert(
        feature + " is part of the Patrly moderation platform."
    );
}

// Dashboard buttons
function dashboardPage(page) {
    alert(
        "The " + page + " dashboard will be available when Patrly's backend is connected."
    );
}

// Reports
function createReport() {
    alert(
        "Report creation will be available once Patrly's backend is connected."
    );
}

function viewReports() {
    alert(
        "Reports will be displayed here once Patrly's backend is connected."
    );
}