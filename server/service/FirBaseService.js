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
  const tokensRef = ref(db, `users/${userId}/tokens`);
  const snapshot = await get(tokensRef);
  let tokens = snapshot.val() || {};
  tokens[token] = true;
  await set(tokensRef, tokens);
};

const getToken = async (userId) => {
  const values = (await get(child(dbRef, `users/${userId}`))).val() ?? {};
  const { token } = values;
  return token;
};

const deleteToken = async (userId, token) => {
  const tokenRef = ref(db, `users/${userId}/tokens/${token}`);
  await remove(tokenRef);
};

module.exports = {
  app,
  saveToken,
  getToken,
  deleteToken,
};
