export default function handler(req, res) {

    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!clientId) {
        return res.status(500).json({
            error: "DISCORD_CLIENT_ID is not configured."
        });
    }

    const protocol =
        req.headers["x-forwarded-proto"] || "https";

    const host =
        req.headers.host;

    const redirectUri =
        `${protocol}://${host}/api/auth/discord`;

    const discordUrl =
        new URL("https://discord.com/oauth2/authorize");

    discordUrl.searchParams.set(
        "client_id",
        clientId
    );

    discordUrl.searchParams.set(
        "response_type",
        "code"
    );

    discordUrl.searchParams.set(
        "redirect_uri",
        redirectUri
    );

    discordUrl.searchParams.set(
        "scope",
        "identify"
    );

    return res.redirect(
        302,
        discordUrl.toString()
    );
}