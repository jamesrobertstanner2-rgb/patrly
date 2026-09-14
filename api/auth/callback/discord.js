const crypto = require("crypto");

function parseCookies(req) {
    const cookies = {};

    const header = req.headers.cookie || "";

    header.split(";").forEach(cookie => {
        const parts = cookie.trim().split("=");

        if (parts.length >= 2) {
            cookies[parts.shift()] = decodeURIComponent(parts.join("="));
        }
    });

    return cookies;
}

function encrypt(text) {
    const key = crypto
        .createHash("sha256")
        .update(process.env.SESSION_SECRET)
        .digest();

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        key,
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");

    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}.${tag}.${encrypted}`;
}

module.exports = async function handler(req, res) {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.status(400).send("Missing OAuth information.");
        }

        const cookies = parseCookies(req);

        if (!cookies.oauth_state || cookies.oauth_state !== state) {
            return res.status(400).send("Invalid OAuth state.");
        }

        const tokenResponse = await fetch(
            "https://discord.com/api/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: process.env.DISCORD_CLIENT_ID,
                    client_secret: process.env.DISCORD_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code,
                    redirect_uri:
                        process.env.DISCORD_REDIRECT_URI
                })
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error(tokenData);
            return res
                .status(500)
                .send("Discord token exchange failed.");
        }

        const accessToken = tokenData.access_token;

        const userResponse = await fetch(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const user = await userResponse.json();

        if (!userResponse.ok) {
            return res
                .status(500)
                .send("Could not retrieve Discord user.");
        }

        const session = {
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                global_name: user.global_name,
                avatar: user.avatar
            }
        };

        const encryptedSession = encrypt(
            JSON.stringify(session)
        );

        res.setHeader("Set-Cookie", [
            `patrly_session=${encryptedSession}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
            `oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
        ]);

        res.writeHead(302, {
            Location: "/servers.html"
        });

        res.end();

    } catch (error) {
        console.error(error);

        res.status(500).send(
            "Something went wrong during Discord login."
        );
    }
};