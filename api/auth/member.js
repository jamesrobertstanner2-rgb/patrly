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

function decrypt(value) {
    const key = crypto
        .createHash("sha256")
        .update(process.env.SESSION_SECRET)
        .digest();

    const parts = value.split(".");

    const iv = Buffer.from(parts[0], "hex");
    const tag = Buffer.from(parts[1], "hex");
    const encrypted = Buffer.from(parts[2], "hex");

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        key,
        iv
    );

    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted);

    decrypted = Buffer.concat([
        decrypted,
        decipher.final()
    ]);

    return JSON.parse(decrypted.toString("utf8"));
}

module.exports = async function handler(req, res) {
    try {
        const guildId = req.query.guildId;

        if (!guildId) {
            return res.status(400).json({
                error: "Missing guildId."
            });
        }

        const cookies = parseCookies(req);

        if (!cookies.patrly_session) {
            return res.status(401).json({
                error: "Not logged in."
            });
        }

        const session = decrypt(
            cookies.patrly_session
        );

        const response = await fetch(
            `https://discord.com/api/users/@me/guilds/${guildId}/member`,
            {
                headers: {
                    Authorization:
                        `Bearer ${session.accessToken}`
                }
            }
        );

        const member = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Could not get your server roles.",
                details: member
            });
        }

        res.status(200).json(member);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to get server member."
        });
    }
};