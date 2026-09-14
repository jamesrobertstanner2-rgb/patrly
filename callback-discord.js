export default async function handler(req, res) {
    try {
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        const redirectUri = process.env.DISCORD_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            return res.status(500).json({
                error: "Discord OAuth environment variables are missing."
            });
        }

        const code = req.query.code;

        if (!code) {
            return res.status(400).json({
                error: "Missing Discord authorization code."
            });
        }

        const tokenResponse = await fetch(
            "https://discord.com/api/v10/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
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
            console.error(
                "Discord token exchange failed:",
                tokenData
            );

            return res.status(500).json({
                error: "Discord token exchange failed."
            });
        }

        const session = Buffer.from(
            JSON.stringify({
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_in: tokenData.expires_in,
                created_at: Date.now()
            })
        ).toString("base64");

        res.setHeader(
            "Set-Cookie",
            `patrly_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
        );

        return res.redirect("/");
    } catch (error) {
        console.error("Discord callback error:", error);

        return res.status(500).json({
            error: "Discord authentication failed."
        });
    }
}