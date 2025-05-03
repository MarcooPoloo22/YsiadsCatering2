// firebase-messaging-sw.js

// Import scripts from Firebase CDN. (These are the compat libraries, which are easier for service workers.)
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDKK93tqPii9fO_uia1pjqvf_Jv1UYH4KM",
  authDomain: "aestheticskinrenewed-baa47.firebaseapp.com",
  projectId: "aestheticskinrenewed-baa47",
  storageBucket: "aestheticskinrenewed-baa47.firebasestorage.app",
  messagingSenderId: "794185118604",
  appId: "1:794185118604:web:7c1b7b443b57c17fde1ca9",
  measurementId: "G-RWX1C98PNP",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize your notification here
  const notificationTitle =
    payload.notification.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification.body || "Background Message body.",
    icon: payload.notification.icon || "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
