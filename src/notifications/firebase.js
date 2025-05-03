// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDKK93tqPii9fO_uia1pjqvf_Jv1UYH4KM",
  authDomain: "aestheticskinrenewed-baa47.firebaseapp.com",
  projectId: "aestheticskinrenewed-baa47",
  storageBucket: "aestheticskinrenewed-baa47.firebasestorage.app",
  messagingSenderId: "794185118604",
  appId: "1:794185118604:web:7c1b7b443b57c17fde1ca9",
  measurementId: "G-RWX1C98PNP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

/*
 * generateToken requests notification permission and gets the registration token.
 * Replace the vapidKey below with the one you generated from the Firebase Console.
 */
export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BJ6uxsH9qdwTEcKrHLydRyM53K-RLdurawR9XmeX8-pEceRnb7Rq8bdglnq7vXkoAPxDFf7_Rg6oFAaXRLTOAKU",
      });
      if (token) {
        console.log("FCM Registration Token:", token);
        // Send this token to your backend if needed.
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    }
  } catch (err) {
    console.error("An error occurred while generating token:", err);
  }
};
