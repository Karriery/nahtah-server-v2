// Import Firebase modules
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set, child } = require("firebase/database");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdy2v7nTiiGulVTtjuc47OBumaseR7was",
  authDomain: "nahtah-f1dc4.firebaseapp.com",
  projectId: "nahtah-f1dc4",
  storageBucket: "nahtah-f1dc4.appspot.com",
  messagingSenderId: "1027183268875",
  appId: "1:1027183268875:web:d13d3775beb0da938ce30e",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const db = getDatabase(app);
const dbRef = ref(db);

// Function to save token to the database
const saveToken = async (userId, token) => {
  const values = (await get(child(dbRef, `users/${userId}`))).val() ?? {};
  const payload = { ...values, token };
  set(ref(db, `users/${userId}`), payload);
};

// Function to get token from the database
const getToken = async (userId) => {
  const values = (await get(child(dbRef, `users/${userId}`))).val() ?? {};
  const { token } = values;
  return token;
};

module.exports = {
  app,
  saveToken,
  getToken,
};
