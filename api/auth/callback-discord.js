export default function handler(req, res) {
    return res.status(200).json({
        ok: true,
        route: "callback-discord",
        message: "Patrly Discord callback route is working"
    });
}
