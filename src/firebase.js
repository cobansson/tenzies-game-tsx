import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKP3Vlp4JEg6G1cOjygPnVQVrgWTPxi6o",
  authDomain: "dices-app.firebaseapp.com",
  projectId: "dices-app",
  storageBucket: "dices-app.appspot.com",
  messagingSenderId: "272735409229",
  appId: "1:272735409229:web:fde7c06d98d43cb893b804"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const dicesCollection = collection(db, "dices");