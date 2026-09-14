import { getSession } from "./session.js";


export default async function handler(
    req,
    res
) {

    try {

        const session =
            getSession(req);


        if (!session) {

            return res.status(401).json({
                error:
                    "You are not logged in."
            });
        }


        const response =
            await fetch(
                "https://discord.com/api/users/@me/guilds",
                {

                    headers: {
                        Authorization:
                            `Bearer ${session.access_token}`
                    }

                }
            );


        const guilds =
            await response.json();


        if (!response.ok) {

            return res.status(
                response.status
            ).json({
                error:
                    "Discord could not return your servers."
            });
        }


        /*
         * Discord's OAuth guild list includes
         * permissions for the user.
         *
         * We only show servers where the user
         * has administrative-level access OR
         * where Patrly has been configured.
         */

        const manageable =
            guilds.filter(
                guild => {

                    const permissions =
                        BigInt(
                            guild.permissions || "0"
                        );


                    const ADMINISTRATOR =
                        0x8n;

                    const MANAGE_GUILD =
                        0x20n;


                    return (
                        (
                            permissions &
                            ADMINISTRATOR
                        ) !== 0n
                    ) ||
                    (
                        (
                            permissions &
                            MANAGE_GUILD
                        ) !== 0n
                    );
                }
            );


        res.status(200).json({

            servers:
                manageable.map(
                    guild => ({

                        id:
                            guild.id,

                        name:
                            guild.name,

                        icon:
                            guild.icon
                    })
                )

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error:
                "Unable to load Discord servers."
        });
    }
}