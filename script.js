async function api(url, options = {}) {
    const response = await fetch(url, {
        credentials: "include",
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Something went wrong."
        );
    }

    return data;
}


/* =========================
   LOGIN
========================= */

function loginWithDiscord() {
    window.location.href = "/api/auth/discord";
}


/* =========================
   LOAD USER
========================= */

async function loadUser() {
    try {

        const data = await api("/api/session");

        const userArea =
            document.getElementById("userArea");

        if (!userArea) return;

        const name =
            data.user.global_name ||
            data.user.username;

        userArea.innerHTML = `
            <div class="user-pill">
                ${escapeHTML(name)}
            </div>
        `;

    } catch {

        const userArea =
            document.getElementById("userArea");

        if (userArea) {
            userArea.innerHTML = `
                <a href="/" class="login-small">
                    Login
                </a>
            `;
        }
    }
}


/* =========================
   SERVERS
========================= */

async function loadServers() {

    const container =
        document.getElementById("serverList");

    if (!container) return;

    try {

        const guilds =
            await api("/api/servers");

        if (!guilds.length) {

            container.innerHTML = `
                <div class="empty-card">

                    <h2>No servers found</h2>

                    <p>
                        We couldn't find any Discord servers
                        connected to your account.
                    </p>

                </div>
            `;

            return;
        }

        container.innerHTML = "";

        guilds.forEach(guild => {

            const card =
                document.createElement("div");

            card.className = "server-card";

            const icon = guild.icon
                ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
                : "";

            card.innerHTML = `

                <div class="server-icon">

                    ${
                        icon
                        ? `<img src="${icon}" alt="">`
                        : `<span>${escapeHTML(
                            guild.name.charAt(0)
                        )}</span>`
                    }

                </div>

                <div class="server-info">

                    <h2>
                        ${escapeHTML(guild.name)}
                    </h2>

                    <p>
                        Discord Server
                    </p>

                </div>

                <button
                    class="primary-button"
                    onclick="selectServer('${guild.id}', '${escapeAttribute(guild.name)}')"
                >
                    Select
                </button>

            `;

            container.appendChild(card);
        });

    } catch (error) {

        container.innerHTML = `
            <div class="empty-card">

                <h2>Couldn't load servers</h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>
        `;
    }

    loadUser();
}


/* =========================
   SELECT SERVER
========================= */

async function selectServer(guildId, guildName) {

    localStorage.setItem(
        "patrly_guild_id",
        guildId
    );

    localStorage.setItem(
        "patrly_guild_name",
        guildName
    );

    window.location.href =
        `/dashboard.html?guild=${guildId}`;
}


/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {

    const serverName =
        document.getElementById("serverName");

    if (!serverName) return;

    const guildId =
        localStorage.getItem("patrly_guild_id");

    const guildName =
        localStorage.getItem("patrly_guild_name");

    if (!guildId) {

        window.location.href =
            "/servers.html";

        return;
    }

    serverName.textContent =
        guildName || "Server";

    await loadUser();

    setupShift();
}


/* =========================
   SHIFT SYSTEM
========================= */

function setupShift() {

    const guildId =
        localStorage.getItem("patrly_guild_id");

    const userShiftKey =
        `patrly_shift_${guildId}`;

    const shift =
        localStorage.getItem(userShiftKey);

    const status =
        document.getElementById("shiftStatus");

    const button =
        document.getElementById("shiftButton");

    if (!status || !button) return;

    if (shift) {

        const started =
            new Date(shift);

        status.innerHTML = `
            You are currently <strong>on shift</strong>.<br>
            Started ${started.toLocaleTimeString()}
        `;

        button.textContent =
            "End Shift";

        button.classList.add(
            "danger-button"
        );

    } else {

        status.textContent =
            "You are currently off shift.";

        button.textContent =
            "Start Shift";

        button.classList.remove(
            "danger-button"
        );
    }
}


function toggleShift() {

    const guildId =
        localStorage.getItem("patrly_guild_id");

    if (!guildId) return;

    const userShiftKey =
        `patrly_shift_${guildId}`;

    const current =
        localStorage.getItem(userShiftKey);

    if (current) {

        localStorage.removeItem(
            userShiftKey
        );

    } else {

        localStorage.setItem(
            userShiftKey,
            new Date().toISOString()
        );
    }

    setupShift();
}


/* =========================
   HELPERS
========================= */

function comingSoon() {
    alert(
        "This Patrly feature is coming next."
    );
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {

    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll('"', "&quot;");
}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadUser
    );

} else {

    loadUser();
}