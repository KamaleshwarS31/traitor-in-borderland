import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let app: any;
let auth: any;

try {
    if (typeof window !== "undefined") {
        if (firebaseConfig.apiKey) {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
        } else {
            console.warn("Firebase API Key is missing. Check your environment variables.");
        }
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export { auth };