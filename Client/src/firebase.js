// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-200c5.firebaseapp.com",
  projectId: "mern-blog-200c5",
  storageBucket: "mern-blog-200c5.appspot.com",
  messagingSenderId: "870122783521",
  appId: "1:870122783521:web:df77891380a997c53e3460"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
