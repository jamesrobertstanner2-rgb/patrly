export default async function handler(req, res) {

    const {
        DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET
    } = process.env;


    if (
        !DISCORD_CLIENT_ID ||
        !DISCORD_CLIENT_SECRET
    ) {

        return res.status(500).json({
            error:
                "Discord OAuth environment variables are missing."
        });

    }


    const host =
        req.headers.host;


    const protocol =
        req.headers["x-forwarded-proto"] ||
        "https";


    const redirectUri =
        `${protocol}://${host}/api/auth/discord`;


    const url =
        new URL(
            `https://discord.com/oauth2/authorize`
        );


    /* =========================
       LOGOUT
    ========================= */

    if (
        req.query.logout === "true"
    ) {

        res.setHeader(
            "Set-Cookie",
            "patrly_access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
        );


        return res.redirect("/");
    }


    /* =========================
       RETURN DISCORD DATA
    ========================= */

    if (
        req.query.data === "true"
    ) {

        const token =
            getCookie(
                req,
                "patrly_access_token"
            );


        if (!token) {

            return res.status(401).json({
                error: "Not logged in."
            });

        }


        const userResponse =
            await discordFetch(
                "https://discord.com/api/users/@me",
                token
            );


        if (!userResponse.ok) {

            return res.status(401).json({
                error: "Discord session expired."
            });

        }


        const user =
            await userResponse.json();


        const guildResponse =
            await discordFetch(
                "https://discord.com/api/users/@me/guilds",
                token
            );


        if (!guildResponse.ok) {

            return res.status(500).json({
                error:
                    "Unable to retrieve Discord servers."
            });

        }


        const guilds =
            await guildResponse.json();


        /*
            MANAGE_GUILD = 0x20
            ADMINISTRATOR = 0x8
        */

        const manageableGuilds =
            guilds.filter(guild => {

                const permissions =
                    BigInt(
                        guild.permissions || "0"
                    );


                const administrator =
                    (
                        permissions &
                        BigInt(0x8)
                    ) !== BigInt(0);


                const manageGuild =
                    (
                        permissions &
                        BigInt(0x20)
                    ) !== BigInt(0);


                return (
                    guild.owner ||
                    administrator ||
                    manageGuild
                );

            });


        return res.status(200).json({

            user: {
                id: user.id,
                username: user.username,
                global_name:
                    user.global_name,
                avatar: user.avatar
            },

            guilds:
                manageableGuilds

        });

    }


    /* =========================
       OAUTH CALLBACK
    ========================= */

    if (
        req.query.code
    ) {

        try {

            const code =
                req.query.code;


            const tokenResponse =
                await fetch(
                    "https://discord.com/api/oauth2/token",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body:
                            new URLSearchParams({

                                client_id:
                                    DISCORD_CLIENT_ID,

                                client_secret:
                                    DISCORD_CLIENT_SECRET,

                                grant_type:
                                    "authorization_code",

                                code,

                                redirect_uri:
                                    redirectUri

                            })

                    }
                );


            const tokenData =
                await tokenResponse.json();


            if (
                !tokenResponse.ok
            ) {

                console.error(
                    tokenData
                );

                return res.status(500).send(
                    "Discord OAuth failed."
                );

            }


            res.setHeader(
                "Set-Cookie",
                `patrly_access_token=${encodeURIComponent(tokenData.access_token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${tokenData.expires_in || 604800}`
            );


            return res.redirect(
                "/?logged_in=true"
            );


        } catch (error) {

            console.error(error);

            return res.status(500).send(
                "Authentication failed."
            );

        }

    }


    /* =========================
       START OAUTH
    ========================= */

    url.searchParams.set(
        "client_id",
        DISCORD_CLIENT_ID
    );


    url.searchParams.set(
        "redirect_uri",
        redirectUri
    );


    url.searchParams.set(
        "response_type",
        "code"
    );


    /*
        identify = Discord account
        guilds   = user's Discord servers
    */

    url.searchParams.set(
        "scope",
        "identify guilds"
    );


    return res.redirect(
        url.toString()
    );

}


/* =========================
   DISCORD REQUEST
========================= */

async function discordFetch(
    url,
    token
) {

    return fetch(
        url,
        {

            headers: {
                Authorization:
                    `Bearer ${token}`
            }

        }
    );

}


/* =========================
   COOKIE READER
========================= */

function getCookie(
    req,
    name
) {

    const cookie =
        req.headers.cookie || "";


    const cookies =
        cookie.split(";");


    for (
        const item of cookies
    ) {

        const [
            key,
            ...value
        ] =
            item.trim().split("=");


        if (
            key === name
        ) {

            return decodeURIComponent(
                value.join("=")
            );

        }

    }


    return null;

}