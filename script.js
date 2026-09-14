/* =========================================================
   PATRLY
   Complete Frontend Script

   Supports:
   - Discord Login
   - Discord Invite
   - Server Selection
   - Moderation Dashboard
   - Staff Access
   - Staff Role Configuration
   - Staff Shifts
   - Logout
   - Landing Page Navigation
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const DISCORD_INVITE =
    "https://discord.gg/Pq4NDY9u4V";

const API = {
    login: "/api/auth/discord",
    session: "/api/auth/session",
    servers: "/api/auth/servers",
    logout: "/api/auth/logout",

    access: "/api/auth/guild/access",
    config: "/api/auth/guild/config",
    logs: "/api/auth/guild/logs",
    shift: "/api/auth/guild/shift"
};


/* =========================================================
   API HELPER
========================================================= */

async function api(url, options = {}) {

    const response = await fetch(url, {
        credentials: "include",

        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },

        ...options
    });


    let data = null;


    try {

        const text =
            await response.text();

        if (text) {
            data = JSON.parse(text);
        }

    } catch {

        data = null;

    }


    if (!response.ok) {

        throw new Error(
            data?.error ||
            data?.message ||
            `Request failed (${response.status})`
        );

    }


    return data;

}


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getGuildId() {

    return localStorage.getItem(
        "patrly_guild_id"
    );

}


function getGuildName() {

    return (
        localStorage.getItem(
            "patrly_guild_name"
        ) || "Discord Server"
    );

}


function setGuild(
    guildId,
    guildName
) {

    localStorage.setItem(
        "patrly_guild_id",
        guildId
    );

    localStorage.setItem(
        "patrly_guild_name",
        guildName || "Discord Server"
    );

}


function clearGuild() {

    localStorage.removeItem(
        "patrly_guild_id"
    );

    localStorage.removeItem(
        "patrly_guild_name"
    );

}


/* =========================================================
   DISCORD LOGIN
========================================================= */

function loginWithDiscord() {

    window.location.href =
        API.login;

}


/* =========================================================
   JOIN PATRLY DISCORD
========================================================= */

function joinDiscord() {

    window.open(
        DISCORD_INVITE,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   CREATE DISCORD SERVER
========================================================= */

function createDiscordServer() {

    window.open(
        "https://discord.com/channels/@me",
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    try {

        await api(
            API.logout,
            {
                method: "POST"
            }
        );

    } catch (error) {

        console.warn(
            "Logout request failed:",
            error.message
        );

    }


    clearGuild();


    window.location.href = "/";

}


/* =========================================================
   PAGE SYSTEM
========================================================= */

function hidePage(element) {

    if (!element) return;

    element.classList.add("hidden");
    element.classList.add("hidden-page");

}


function showPageElement(element) {

    if (!element) return;

    element.classList.remove("hidden");
    element.classList.remove("hidden-page");

}


function showPage(pageId) {

    const pages = [
        "landingPage",
        "serverPage",
        "moderationPage"
    ];


    pages.forEach(id => {

        const page =
            document.getElementById(id);

        if (!page) return;


        if (id === pageId) {

            showPageElement(page);

        } else {

            hidePage(page);

        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   SHOW LANDING
========================================================= */

function showLanding() {

    showPage(
        "landingPage"
    );

}


/* =========================================================
   CURRENT USER
========================================================= */

async function loadUser() {

    try {

        const data =
            await api(API.session);


        const user =
            data?.user;


        if (!user) {

            return null;

        }


        const name =
            user.global_name ||
            user.username ||
            "Discord User";


        const userBox =
            document.getElementById(
                "userBox"
            );


        if (userBox) {

            let avatarHTML = "";


            if (user.avatar && user.id) {

                avatarHTML = `
                    <img
                        src="https://cdn.discordapp.com/avatars/${encodeURIComponent(
                            user.id
                        )}/${encodeURIComponent(
                            user.avatar
                        )}.png?size=128"
                        alt=""
                        class="user-avatar"
                    >
                `;

            } else {

                avatarHTML = `
                    <div class="user-avatar fallback">
                        ${escapeHTML(
                            name.charAt(0).toUpperCase()
                        )}
                    </div>
                `;

            }


            userBox.innerHTML = `

                <div class="user-box-inner">

                    ${avatarHTML}

                    <div>

                        <strong>
                            ${escapeHTML(name)}
                        </strong>

                        <span>
                            Discord account connected
                        </span>

                    </div>

                </div>

            `;

        }


        return user;


    } catch (error) {

        console.warn(
            "No Discord session:",
            error.message
        );


        return null;

    }

}


/* =========================================================
   LOAD SERVERS
========================================================= */

async function loadServers() {

    const container =
        document.getElementById(
            "serverGrid"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="loading-card">

            <div class="spinner"></div>

            Loading your servers...

        </div>

    `;


    try {

        const result =
            await api(API.servers);


        let guilds = [];


        if (Array.isArray(result)) {

            guilds = result;

        } else if (
            Array.isArray(result?.guilds)
        ) {

            guilds = result.guilds;

        } else if (
            Array.isArray(result?.servers)
        ) {

            guilds = result.servers;

        }


        if (!guilds.length) {

            container.innerHTML = `

                <div class="empty-card">

                    <h2>
                        No manageable servers
                    </h2>

                    <p>
                        We couldn't find any Discord
                        servers available to manage
                        with Patrly.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        guilds.forEach(guild => {

            if (!guild?.id) return;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "server-card";


            const serverName =
                guild.name ||
                "Discord Server";


            const iconURL =
                guild.icon
                    ? `https://cdn.discordapp.com/icons/${encodeURIComponent(
                        guild.id
                    )}/${encodeURIComponent(
                        guild.icon
                    )}.png?size=128`
                    : null;


            const canManage =
                guild.canManage !== false &&
                guild.available !== false;


            const staffRoleName =
                guild.staffRoleName ||
                guild.roleName ||
                null;


            card.innerHTML = `

                <div class="server-icon">

                    ${
                        iconURL

                        ?

                        `
                            <img
                                src="${iconURL}"
                                alt=""
                            >
                        `

                        :

                        `
                            <span>
                                ${escapeHTML(
                                    serverName
                                        .charAt(0)
                                        .toUpperCase()
                                )}
                            </span>
                        `
                    }

                </div>


                <div class="server-info">

                    <h2>
                        ${escapeHTML(serverName)}
                    </h2>

                    <p>

                        ${
                            staffRoleName

                            ?

                            `Staff role:
                            ${escapeHTML(
                                staffRoleName
                            )}`

                            :

                            "Discord Server"
                        }

                    </p>

                </div>


                <button
                    class="primary-button server-select-button"
                    type="button"
                >

                    ${
                        canManage
                            ? "Manage"
                            : "Unavailable"
                    }

                </button>

            `;


            const button =
                card.querySelector(
                    ".server-select-button"
                );


            if (!canManage) {

                button.disabled = true;

            } else {

                button.addEventListener(
                    "click",
                    () => {

                        selectServer(
                            guild.id,
                            serverName
                        );

                    }
                );

            }


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Server loading failed:",
            error
        );


        container.innerHTML = `

            <div class="empty-card">

                <h2>
                    Couldn't load servers
                </h2>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>


                <button
                    class="secondary-button"
                    type="button"
                    onclick="loadServers()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


/* =========================================================
   SELECT SERVER
========================================================= */

async function selectServer(
    guildId,
    guildName
) {

    if (!guildId) {

        alert(
            "This server does not have a valid Discord ID."
        );

        return;

    }


    setGuild(
        guildId,
        guildName
    );


    const selectedName =
        document.getElementById(
            "selectedServerName"
        );


    if (selectedName) {

        selectedName.textContent =
            guildName || "Discord Server";

    }


    showPage(
        "moderationPage"
    );


    await loadServerAccess();

}


/* =========================================================
   BACK TO SERVERS
========================================================= */

function backToServers() {

    showPage(
        "serverPage"
    );


    loadServers();

}


/* =========================================================
   SERVER ACCESS
========================================================= */

async function loadServerAccess() {

    const guildId =
        getGuildId();


    const notice =
        document.getElementById(
            "staffAccessNotice"
        );


    const status =
        document.getElementById(
            "serverStatus"
        );


    if (!guildId) {

        if (notice) {

            notice.textContent =
                "Please select a server first.";

        }

        return;

    }


    if (notice) {

        notice.textContent =
            "Checking your staff access...";

    }


    if (status) {

        status.textContent =
            "● Checking...";

    }


    try {

        const result =
            await api(
                `${API.access}?guildId=${encodeURIComponent(
                    guildId
                )}`
            );


        const hasAccess =
            result?.hasAccess ??
            result?.access ??
            result?.allowed ??
            result?.isStaff;


        if (hasAccess === false) {

            if (notice) {

                notice.innerHTML = `
                    <strong>
                        Staff access required
                    </strong>

                    <span>
                        You don't currently have
                        access to Patrly staff tools
                        in this server.
                    </span>
                `;

            }


            if (status) {

                status.textContent =
                    "● Staff access required";

            }


            disableModerationCards();

            return;

        }


        if (notice) {

            notice.innerHTML = `
                <strong>
                    Staff access confirmed
                </strong>

                <span>
                    You can use Patrly tools
                    for this server.
                </span>
            `;

        }


        if (status) {

            status.textContent =
                "● Connected";

        }


        enableModerationCards();


        await loadStaffRole();


        setupShift();


    } catch (error) {

        console.warn(
            "Staff access check failed:",
            error.message
        );


        /*
         * If the access endpoint hasn't been
         * fully connected yet, don't lock the
         * interface completely.
         */

        if (notice) {

            notice.innerHTML = `
                <strong>
                    Staff access
                </strong>

                <span>
                    Patrly could not verify your
                    staff role yet.
                </span>
            `;

        }


        if (status) {

            status.textContent =
                "● Connected";

        }


        enableModerationCards();

        await loadStaffRole();

        setupShift();

    }

}


/* =========================================================
   MODERATION CARDS
========================================================= */

function getModerationCards() {

    return document.querySelectorAll(
        ".moderation-card"
    );

}


function disableModerationCards() {

    getModerationCards()
        .forEach(card => {

            card.disabled = true;

            card.classList.add(
                "disabled"
            );

        });

}


function enableModerationCards() {

    getModerationCards()
        .forEach(card => {

            card.disabled = false;

            card.classList.remove(
                "disabled"
            );

        });

}


/* =========================================================
   OPEN MODERATION TOOL
========================================================= */

function openModerationTool(tool) {

    const guildId =
        getGuildId();


    if (!guildId) {

        alert(
            "Please select a server first."
        );

        showPage(
            "serverPage"
        );

        return;

    }


    switch (tool) {

        case "Reports":

            showComingSoon(
                "Reports"
            );

            break;


        case "Warnings":

            showComingSoon(
                "Warnings"
            );

            break;


        case "Logs":

            openLogs();

            break;


        case "Settings":

            openSettings();

            break;


        case "Shift":

            openShift();

            break;


        default:

            showComingSoon(
                tool
            );

    }

}


/* =========================================================
   COMPATIBILITY ALIAS
   Your current HTML uses openTool()
========================================================= */

function openTool(tool) {

    openModerationTool(
        tool
    );

}


/* =========================================================
   COMING SOON
========================================================= */

function showComingSoon(tool) {

    showToast(
        `${tool} is coming next in Patrly.`
    );

}


/* =========================================================
   SHIFT
========================================================= */

function getShiftKey() {

    const guildId =
        getGuildId();


    if (!guildId) {

        return null;

    }


    return `patrly_shift_${guildId}`;

}


/* =========================================================
   OPEN SHIFT
========================================================= */

function openShift() {

    const panel =
        document.getElementById(
            "shiftPanel"
        );


    if (!panel) {

        return;

    }


    const settings =
        document.getElementById(
            "roleSetupPanel"
        );


    if (settings) {

        settings.classList.add(
            "hidden"
        );

    }


    panel.classList.remove(
        "hidden"
    );


    setupShift();


    panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   SHIFT SETUP
========================================================= */

function setupShift() {

    const key =
        getShiftKey();


    const status =
        document.getElementById(
            "shiftStatus"
        );


    const button =
        document.getElementById(
            "shiftButton"
        );


    if (!key || !status || !button) {

        return;

    }


    const stored =
        localStorage.getItem(
            key
        );


    if (stored) {

        const started =
            new Date(stored);


        status.innerHTML = `

            <span class="shift-online">
                ON SHIFT
            </span>

            <small>
                Started
                ${escapeHTML(
                    started.toLocaleTimeString()
                )}
            </small>

        `;


        button.textContent =
            "End Shift";


        button.classList.add(
            "danger-button"
        );


    } else {

        status.innerHTML = `

            <span class="shift-offline">
                OFF SHIFT
            </span>

            <small>
                You are not currently
                on shift.
            </small>

        `;


        button.textContent =
            "Start Shift";


        button.classList.remove(
            "danger-button"
        );

    }

}


/* =========================================================
   TOGGLE SHIFT
========================================================= */

async function toggleShift() {

    const guildId =
        getGuildId();


    if (!guildId) {

        alert(
            "Please select a server first."
        );

        return;

    }


    const key =
        getShiftKey();


    if (!key) return;


    const current =
        localStorage.getItem(
            key
        );


    try {

        /*
         * Try the real backend first.
         */

        const result =
            await api(
                API.shift,
                {
                    method: "POST",

                    body: JSON.stringify({

                        guildId,

                        action:
                            current
                                ? "end"
                                : "start"

                    })
                }
            );


        /*
         * Backend accepted the request.
         */

        if (current) {

            localStorage.removeItem(
                key
            );


            showToast(
                "Your shift has ended."
            );

        } else {

            localStorage.setItem(
                key,
                new Date().toISOString()
            );


            showToast(
                "Your shift has started."
            );

        }


        setupShift();


        return;


    } catch (error) {

        console.warn(
            "Backend shift unavailable:",
            error.message
        );

    }


    /*
     * Temporary local fallback.
     *
     * This allows the UI to work while the
     * backend shift endpoint is still being
     * connected.
     */

    if (current) {

        localStorage.removeItem(
            key
        );


        showToast(
            "Your shift has ended."
        );

    } else {

        localStorage.setItem(
            key,
            new Date().toISOString()
        );


        showToast(
            "Your shift has started."
        );

    }


    setupShift();

}


/* =========================================================
   SETTINGS
========================================================= */

function openSettings() {

    const panel =
        document.getElementById(
            "roleSetupPanel"
        );


    if (!panel) {

        showComingSoon(
            "Settings"
        );

        return;

    }


    const shiftPanel =
        document.getElementById(
            "shiftPanel"
        );


    if (shiftPanel) {

        shiftPanel.classList.add(
            "hidden"
        );

    }


    panel.classList.remove(
        "hidden"
    );


    loadStaffRole();


    panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   LOAD STAFF ROLE
========================================================= */

async function loadStaffRole() {

    const input =
        document.getElementById(
            "staffRoleId"
        );


    if (!input) return;


    const guildId =
        getGuildId();


    if (!guildId) return;


    try {

        const result =
            await api(
                `${API.config}?guildId=${encodeURIComponent(
                    guildId
                )}`
            );


        const roleId =
            result?.staffRoleId ||
            result?.roleId ||
            result?.staff_role_id ||
            "";


        if (roleId) {

            input.value =
                roleId;

        }


    } catch (error) {

        console.warn(
            "Could not load staff role:",
            error.message
        );

    }

}


/* =========================================================
   SAVE STAFF ROLE
========================================================= */

async function saveStaffRole() {

    const input =
        document.getElementById(
            "staffRoleId"
        );


    const guildId =
        getGuildId();


    if (!input || !guildId) {

        alert(
            "Please select a server first."
        );

        return;

    }


    const roleId =
        input.value.trim();


    if (!/^\d{17,20}$/.test(roleId)) {

        alert(
            "Please enter a valid Discord role ID."
        );

        return;

    }


    try {

        await api(
            API.config,
            {
                method: "POST",

                body: JSON.stringify({

                    guildId,

                    staffRoleId:
                        roleId

                })

            }
        );


        showToast(
            "Staff role saved."
        );


        await loadServerAccess();


    } catch (error) {

        console.error(
            "Could not save staff role:",
            error
        );


        alert(
            `Could not save staff role:\n\n${error.message}`
        );

    }

}


/* =========================================================
   LOGS
========================================================= */

async function openLogs() {

    const guildId =
        getGuildId();


    if (!guildId) {

        alert(
            "Please select a server first."
        );

        return;

    }


    try {

        const result =
            await api(
                `${API.logs}?guildId=${encodeURIComponent(
                    guildId
                )}`
            );


        /*
         * If the backend already returns
         * logs, display a simple summary.
         */

        const logs =
            Array.isArray(result)
                ? result
                : result?.logs || [];


        if (!logs.length) {

            showToast(
                "No moderation logs found."
            );

            return;

        }


        showToast(
            `${logs.length} moderation log${
                logs.length === 1
                    ? ""
                    : "s"
            } found.`
        );


    } catch (error) {

        console.warn(
            "Logs endpoint unavailable:",
            error.message
        );


        showComingSoon(
            "Moderation Logs"
        );

    }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toast";


        toast.className =
            "toast";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.patrlyToastTimer
    );


    window.patrlyToastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* =========================================================
   COMPATIBILITY
========================================================= */

function showShiftMessage(message) {

    showToast(
        message
    );

}


/* =========================================================
   NAVIGATION LINKS
========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(
            '.nav-links a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link
                            .getAttribute("href")
                            .substring(1);


                    const target =
                        document.getElementById(
                            targetId
                        );


                    if (!target) return;


                    event.preventDefault();


                    showPage(
                        "landingPage"
                    );


                    setTimeout(() => {

                        target.scrollIntoView({
                            behavior: "smooth"
                        });

                    }, 50);

                }
            );

        });

}


/* =========================================================
   LANDING BUTTONS
========================================================= */

function setupLandingButtons() {

    console.log(
        "Patrly buttons ready."
    );

}


/* =========================================================
   INITIALISE PATRLY
========================================================= */

async function initialisePatrly() {

    const landing =
        document.getElementById(
            "landingPage"
        );


    const serverPage =
        document.getElementById(
            "serverPage"
        );


    const moderationPage =
        document.getElementById(
            "moderationPage"
        );


    setupLandingButtons();

    setupNavigation();


    /*
     * Landing page should initially
     * remain visible while we check
     * the Discord session.
     */

    if (landing) {

        showPageElement(
            landing
        );

    }


    if (serverPage) {

        hidePage(
            serverPage
        );

    }


    if (moderationPage) {

        hidePage(
            moderationPage
        );

    }


    /*
     * Check Discord login.
     */

    const user =
        await loadUser();


    if (!user) {

        /*
         * User isn't logged in.
         */

        showPage(
            "landingPage"
        );

        return;

    }


    /*
     * User is logged in.
     */

    if (landing) {

        hidePage(
            landing
        );

    }


    const savedGuild =
        getGuildId();


    if (savedGuild) {

        const savedName =
            getGuildName();


        const selectedName =
            document.getElementById(
                "selectedServerName"
            );


        if (selectedName) {

            selectedName.textContent =
                savedName;

        }


        showPage(
            "moderationPage"
        );


        await loadServerAccess();


    } else {

        showPage(
            "serverPage"
        );


        await loadServers();

    }

}


/* =========================================================
   AUTO START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialisePatrly
    );

} else {

    initialisePatrly();

}