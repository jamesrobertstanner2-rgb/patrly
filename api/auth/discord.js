export default function handler(req, res) {
    const clientId = process.env.DISCORD_CLIENT_ID;

    const redirectUri =
        process.env.DISCORD_REDIRECT_URI ||
        "https://patrly.vercel.app/api/auth/callback-discord";

    if (!clientId) {
        return res.status(500).json({
            error: "DISCORD_CLIENT_ID environment variable is missing."
        });
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "identify guilds"
    });

    return res.redirect(
        `https://discord.com/oauth2/authorize?${params.toString()}`
    );
}