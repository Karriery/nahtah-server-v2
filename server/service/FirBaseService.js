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

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const dbRef = ref(db);

const saveToken = async (userId, token) => {
  const values = (await get(child(dbRef, `users/${userId}`))).val() ?? {};
  const payload = { ...values, token };
  set(ref(db, `users/${userId}`), payload);
};

const getToken = async (userId) => {
  const values = (await get(child(dbRef, `users/${userId}`))).val() ?? {};
  const { token } = values;
  return token;
};

const GetUsers = async () => {
  const values = (await get(child(dbRef, `users`))).val() ?? {};
  return values;
};

const deleteToken = async (userId) => {
  set(ref(db, `users/${userId}`), null);
};

module.exports = {
  app,
  saveToken,
  getToken,
  deleteToken,
  GetUsers,
};
