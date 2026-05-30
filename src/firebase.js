import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

/*
apiKey: "AIzaSyCRXIgrELGNPRNGYtuTK1ydwFxU7ooh0Cc",
  authDomain: "react-login-63ff4.firebaseapp.com",
  databaseURL: "https://react-login-63ff4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-login-63ff4",
  storageBucket: "react-login-63ff4.firebasestorage.app",
  messagingSenderId: "850618271895",
  appId: "1:850618271895:web:1cf7833ba7f0c3b5db01d2"
 */
const firebaseConfig = {
  apiKey: "AIzaSyCRXIgrELGNPRNGYtuTK1ydwFxU7ooh0Cc",
  authDomain: "react-login-63ff4.firebaseapp.com",
  databaseURL: "https://react-login-63ff4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-login-63ff4",
  storageBucket: "react-login-63ff4.firebasestorage.app",
  messagingSenderId: "850618271895",
  appId: "1:850618271895:web:1cf7833ba7f0c3b5db01d2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);