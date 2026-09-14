const crypto = require("crypto");

module.exports = function handler(req, res) {
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!clientId) {
        return res.status(500).send("DISCORD_CLIENT_ID is not configured.");
    }

    const state = crypto.randomBytes(32).toString("hex");

    res.setHeader(
        "Set-Cookie",
        `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
    );

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        scope: "identify guilds guilds.members.read"
    });

    res.writeHead(302, {
        Location: `https://discord.com/oauth2/authorize?${params.toString()}`
    });

    res.end();
};