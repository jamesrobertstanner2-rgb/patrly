export default async function handler(req, res) {
    const clientId = process.env.DISCORD_CLIENT_ID;

    const redirectUri =
        `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/auth/discord`;

    const discordUrl = new URL("https://discord.com/oauth2/authorize");

    discordUrl.searchParams.set("client_id", clientId);
    discordUrl.searchParams.set("response_type", "code");
    discordUrl.searchParams.set("redirect_uri", redirectUri);
    discordUrl.searchParams.set("scope", "identify");

    res.redirect(302, discordUrl.toString());
}