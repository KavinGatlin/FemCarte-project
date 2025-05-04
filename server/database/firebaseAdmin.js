import admin from "firebase-admin";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Get the current directory path
const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = resolve(__dirname, "../database/firebase-service-account.json");

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

// Middleware to verify Google token
export const verifyGoogleToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired Google token" });
        }

        req.user = decodedToken; // Attach user data to request
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Google Token Verification Failed:", error);
        res.status(401).json({ message: error.message || "Invalid or expired Google token" });
    }
};

export default admin;
