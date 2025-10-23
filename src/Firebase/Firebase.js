
// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJN3Fpm45i3FolQKhi2FzXC49-5HZhOPs",
  authDomain: "e-commerce-yt-12590.firebaseapp.com",
  projectId: "e-commerce-yt-12590",
  storageBucket: "e-commerce-yt-12590.firebasestorage.app",
  messagingSenderId: "1047447026897",
  appId: "1:1047447026897:web:9f77d2e157071dcb0919f0"
};

// Initialize Firebase
const app = getApps().length? getApps()[0]: initializeApp(firebaseConfig)
const db = getFirestore(app);
const auth = getAuth(app);

export {auth}
export default db