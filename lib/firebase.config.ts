import { initializeApp, } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDuIz53oP_90meHsRIG9Ri7xx-AvYITP0M",
    authDomain: "oanic-ai.firebaseapp.com",
    projectId: "oanic-ai",
    storageBucket: "oanic-ai.firebasestorage.app",
    messagingSenderId: "6955535030",
    appId: "1:6955535030:web:a2750361da72a65a403417"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };