const admin = require("firebase-admin");
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (process.env.FIREBASE_PROJECT_ID) {
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
} else {
    try {
        serviceAccount = require("../traitor-in-borderland-firebase-adminsdk-fbsvc-23829d8c79.json");
    } catch (error) {
        console.error("Firebase credentials missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or ensure file exists.");
        process.exit(1);
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;