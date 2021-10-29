// Import the functions you need from the SDKs you need
import { getAuth, signInAnonymously, updateProfile } from 'firebase/auth';
import { getFirestore, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./Environment";

// Initialize Firebase

export const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const db = getFirestore()
export const auth = getAuth()
export const initLoggerRegistration = signInAnonymously
export const addDocRef = addDoc
export const collectionRef = collection
export const docRef = doc
export const setDocRef = setDoc
export const updateProfileData = updateProfile