import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoyHES7bZTspsdP7JkX0cNv2YDjObkmTo",
  authDomain : "lavadotrack.firebaseapp.com" , 
  projectId: "lavadotrack",
  storageBucket: "lavadotrack.firebasestorage.app",
  messagingSenderId: "787708094388",
  appId: "1:787708094388:web:3fa60f67ab44000d6074e1",
  measurementId: "G-DCT7HKEPRM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);