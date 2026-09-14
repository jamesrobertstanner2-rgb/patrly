// ========================================
// PATRLY
// Website JavaScript
// ========================================


// ========================================
// DISCORD
// ========================================

function loginWithDiscord() {
    window.location.href = "/api/auth/discord";
}

function openSignup() {
    window.location.href = "/api/auth/discord";
}

function joinDiscord() {
    window.open(
        "https://discord.gg/eWQr8HRr5W",
        "_blank",
        "noopener,noreferrer"
    );
}


// ========================================
// NAVIGATION
// ========================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) {
        console.warn("Section not found:", sectionId);
        return;
    }

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ========================================
// FEATURES
// ========================================

function openFeature(feature) {
    const messages = {
        moderation:
            "Patrly gives your ERLC community powerful moderation tools.",

        reports:
            "Manage player reports and keep track of moderation activity.",

        dashboard:
            "The Patrly dashboard gives your staff a central place to manage your community.",

        logging:
            "Keep track of important moderation and server activity.",

        automod:
            "Automated moderation helps your staff keep your community safe.",

        commands:
            "Use Patrly commands to manage your ERLC community."
    };

    const message =
        messages[feature] ||
        "This Patrly feature will be available when the platform is connected.";

    alert(message);
}


// ========================================
// DASHBOARD
// ========================================

function dashboardPage(page) {
    const pages = {
        overview: "Dashboard Overview",
        moderation: "Moderation",
        reports: "Reports",
        members: "Members",
        settings: "Settings"
    };

    const title = pages[page] || page;

    alert(
        title +
        " will open here once your Patrly dashboard backend is connected."
    );
}


// ========================================
// REPORTS
// ========================================

function createReport() {
    alert(
        "Report creation will be available once Patrly's backend is connected."
    );
}

function viewReports() {
    alert(
        "Your reports will appear here once Patrly's backend is connected."
    );
}


// ========================================
// BUTTON SETUP
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // Login buttons
    document.querySelectorAll("[data-login]").forEach(function (button) {
        button.addEventListener("click", loginWithDiscord);
    });


    // Get Started buttons
    document.querySelectorAll("[data-signup]").forEach(function (button) {
        button.addEventListener("click", openSignup);
    });


    // Join Discord buttons
    document.querySelectorAll("[data-discord]").forEach(function (button) {
        button.addEventListener("click", joinDiscord);
    });


    // Navigation buttons
    document.querySelectorAll("[data-scroll]").forEach(function (button) {
        button.addEventListener("click", function () {
            scrollToSection(button.dataset.scroll);
        });
    });


    // Feature buttons
    document.querySelectorAll("[data-feature]").forEach(function (button) {
        button.addEventListener("click", function () {
            openFeature(button.dataset.feature);
        });
    });


    // Dashboard buttons
    document.querySelectorAll("[data-dashboard]").forEach(function (button) {
        button.addEventListener("click", function () {
            dashboardPage(button.dataset.dashboard);
        });
    });


    // Report creation
    document.querySelectorAll("[data-create-report]").forEach(function (button) {
        button.addEventListener("click", createReport);
    });


    // View reports
    document.querySelectorAll("[data-view-reports]").forEach(function (button) {
        button.addEventListener("click", viewReports);
    });

});


// ========================================
// BACKUP CLICK HANDLER
// ========================================

// This also supports buttons using onclick="loginWithDiscord()"
// or onclick="joinDiscord()" directly.

window.loginWithDiscord = loginWithDiscord;
window.openSignup = openSignup;
window.joinDiscord = joinDiscord;
window.scrollToSection = scrollToSection;
window.openFeature = openFeature;
window.dashboardPage = dashboardPage;
window.createReport = createReport;
window.viewReports = viewReports;