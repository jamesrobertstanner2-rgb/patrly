const crypto = require("crypto");

function parseCookies(req) {
    const cookies = {};

    const header = req.headers.cookie || "";

    header.split(";").forEach(cookie => {
        const parts = cookie.trim().split("=");

        if (parts.length >= 2) {
            cookies[parts.shift()] = decodeURIComponent(parts.join("="));
        }
    });

    return cookies;
}

function decrypt(value) {
    const key = crypto
        .createHash("sha256")
        .update(process.env.SESSION_SECRET)
        .digest();

    const parts = value.split(".");

    if (parts.length !== 3) {
        throw new Error("Invalid session.");
    }

    const iv = Buffer.from(parts[0], "hex");
    const tag = Buffer.from(parts[1], "hex");
    const encrypted = Buffer.from(parts[2], "hex");

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        key,
        iv
    );

    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([
        decrypted,
        decipher.final()
    ]);

    return JSON.parse(decrypted.toString("utf8"));
}

module.exports = function handler(req, res) {
    try {
        const cookies = parseCookies(req);

        if (!cookies.patrly_session) {
            return res.status(401).json({
                authenticated: false
            });
        }

        const session = decrypt(
            cookies.patrly_session
        );

        res.status(200).json({
            authenticated: true,
            user: session.user
        });

    } catch (error) {
        res.status(401).json({
            authenticated: false
        });
    }
};