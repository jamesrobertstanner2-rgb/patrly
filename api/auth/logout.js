export default function handler(
    req,
    res
) {

    res.setHeader(
        "Set-Cookie",
        "patrly_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    );


    res.status(200).json({
        success: true
    });
}