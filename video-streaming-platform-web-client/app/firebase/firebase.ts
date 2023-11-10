// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
    GithubAuthProvider
} from "firebase/auth";
import { getFunctions } from "firebase/functions";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDOVXe43WhDFG-uBC9ZA9GoBZR6oAT9cIo",
    authDomain: "video-streaming-platform-d287d.firebaseapp.com",
    projectId: "video-streaming-platform-d287d",
    appId: "1:1037414281747:web:84a30999993a5f824b85e6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions();
/**
 * 
 * @param providerName - type of sign in we do either google, facebook or github
 * @returns a promise that resolves with the user's credentials.
 */
export function signInWithProvider(providerName: string) {
    let provider

    switch (providerName) {
        case 'Google':
            provider = new GoogleAuthProvider();
            break;

        case 'GitHub':
            provider = new GithubAuthProvider();
            break;
        default:
            throw new Error(`Unsupported provider: ${providerName}`);
    }
    return signInWithPopup(auth, provider);
}

/**
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Triggers a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}