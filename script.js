/*
    PATRLY
    Main website JavaScript
*/


const DISCORD_INVITE =
    "https://discord.gg/eWQr8HRr5W";


/* =========================
   DISCORD LOGIN
========================= */

function loginWithDiscord() {

    window.location.href = "/api/auth/discord";

}


/* =========================
   JOIN DISCORD
========================= */

function joinDiscord() {

    window.open(
        DISCORD_INVITE,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================
   SHOW SERVER PAGE
========================= */

function showServerPage() {

    document
        .getElementById("landingPage")
        .classList.add("hidden-page");

    document
        .getElementById("serverPage")
        .classList.remove("hidden-page");

    window.scrollTo(0, 0);

    loadDashboard();

}


/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {

    const serverGrid =
        document.getElementById("serverGrid");

    const userBox =
        document.getElementById("userBox");


    try {

        const response =
            await fetch("/api/auth/discord?data=true");


        if (!response.ok) {

            throw new Error(
                "Unable to load Discord data."
            );

        }


        const data =
            await response.json();


        if (!data.user) {

            window.location.href =
                "/api/auth/discord";

            return;

        }


        userBox.innerHTML = `
            Logged in as
            <strong>
                ${escapeHTML(
                    data.user.global_name ||
                    data.user.username
                )}
            </strong>
        `;


        renderServers(data.guilds || []);


    } catch (error) {

        console.error(error);


        serverGrid.innerHTML = `
            <div class="loading-card">
                <h2>Unable to load servers</h2>
                <p style="margin-top:10px;">
                    Please login with Discord again.
                </p>

                <button
                    class="primary-button"
                    style="margin-top:20px;"
                    onclick="loginWithDiscord()"
                >
                    Login Again
                </button>
            </div>
        `;

    }

}


/* =========================
   RENDER SERVERS
========================= */

function renderServers(guilds) {

    const serverGrid =
        document.getElementById("serverGrid");


    if (!guilds.length) {

        serverGrid.innerHTML = `
            <div class="loading-card">

                <h2>No manageable servers found</h2>

                <p style="margin-top:10px;">
                    You need permission to manage a Discord
                    server before it can appear here.
                </p>

            </div>
        `;

        return;

    }


    serverGrid.innerHTML = "";


    guilds.forEach(server => {

        const card =
            document.createElement("div");


        card.className =
            "server-card";


        const icon =
            server.icon
                ? `
                    <img
                        src="https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=128"
                        alt=""
                    >
                  `
                : escapeHTML(
                    server.name
                        .substring(0, 1)
                        .toUpperCase()
                );


        card.innerHTML = `

            <div class="server-icon">
                ${icon}
            </div>

            <h2>
                ${escapeHTML(server.name)}
            </h2>

            <p>
                Discord Server
            </p>

            <button
                class="manage-button"
                onclick='openServer(${JSON.stringify(server)})'
            >
                Manage Server →
            </button>

        `;


        serverGrid.appendChild(card);

    });

}


/* =========================
   OPEN SERVER
========================= */

function openServer(server) {

    sessionStorage.setItem(
        "selectedServer",
        JSON.stringify(server)
    );


    document
        .getElementById("serverPage")
        .classList.add("hidden-page");


    document
        .getElementById("moderationPage")
        .classList.remove("hidden-page");


    document
        .getElementById("selectedServerName")
        .textContent =
        server.name;


    window.scrollTo(0, 0);

}


/* =========================
   BACK TO SERVERS
========================= */

function backToServers() {

    document
        .getElementById("moderationPage")
        .classList.add("hidden-page");


    document
        .getElementById("serverPage")
        .classList.remove("hidden-page");


    window.scrollTo(0, 0);

}


/* =========================
   MODERATION TOOLS
========================= */

function openModerationTool(tool) {

    alert(
        tool +
        " is coming next in the Patrly moderation dashboard."
    );

}


/* =========================
   CREATE DISCORD SERVER
========================= */

function createDiscordServer() {

    window.open(
        "https://discord.com/channels/@me",
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================
   LOGOUT
========================= */

function logout() {

    sessionStorage.removeItem(
        "selectedServer"
    );


    window.location.href =
        "/api/auth/discord?logout=true";

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================
   CHECK URL
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        if (
            params.get("logged_in") === "true"
        ) {

            showServerPage();

        }

    }
);