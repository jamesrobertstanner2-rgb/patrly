import crypto from "crypto";


function getCookie(
    req,
    name
) {

    const cookies =
        req.headers.cookie || "";


    const parts =
        cookies.split(";");


    for (
        const part of parts
    ) {

        const [
            key,
            ...value
        ] =
            part.trim().split("=");


        if (
            key === name
        ) {

            return value.join("=");
        }
    }


    return null;
}


function verifySession(
    session
) {

    if (!session) {
        return null;
    }


    const secret =
        process.env.SESSION_SECRET;

    if (!secret) {
        return null;
    }


    const [
        payload,
        signature
    ] =
        session.split(".");


    if (
        !payload ||
        !signature
    ) {
        return null;
    }


    const expected =
        crypto
            .createHmac(
                "sha256",
                secret
            )
            .update(payload)
            .digest(
                "base64url"
            );


    if (
        !crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expected)
        )
    ) {

        return null;
    }


    try {

        return JSON.parse(
            Buffer.from(
                payload,
                "base64url"
            ).toString()
        );

    } catch {

        return null;
    }
}


export function getSession(req) {

    const cookie =
        getCookie(
            req,
            "patrly_session"
        );


    return verifySession(
        cookie
    );
}


export default function handler(
    req,
    res
) {

    const session =
        getSession(req);


    if (!session) {

        return res.status(401).json({
            error: "Not logged in."
        });
    }


    res.status(200).json({

        user: {
            id:
                session.id,

            username:
                session.username,

            global_name:
                session.global_name,

            avatar:
                session.avatar
        }

    });
}