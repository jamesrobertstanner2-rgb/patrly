export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Missing Discord authorization code.");
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).send("Discord environment variables are missing.");
    }

    const redirectUri =
        "https://patrly.vercel.app/api/auth/callback/discord";

    try {
        const tokenResponse = await fetch(
            "https://discord.com/api/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: redirectUri
                })
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error(tokenData);
            return res.status(400).send("Discord authorization failed.");
        }

        const userResponse = await fetch(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    Authorization: `${tokenData.token_type} ${tokenData.access_token}`
                }
            }
        );

        const user = await userResponse.json();

        if (!userResponse.ok) {
            return res.status(400).send("Could not retrieve Discord user.");
        }

        // Send the user to the Patrly dashboard.
        const dashboardUrl =
            "https://patrly.vercel.app/dashboard.html";

        return res.redirect(dashboardUrl);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Something went wrong during Discord login.");
    }
}