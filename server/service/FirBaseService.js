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
  const userDataRef = ref(db, `users/${userId}`);
  const snapshot = await get(userDataRef);
  const userData = snapshot.val() ?? {};

  // Check if the user already has tokens array, if not create one
  const tokens = userData.tokens ? userData.tokens : [];

  // Check if the token already exists in the tokens array
  if (!tokens.includes(token)) {
    // Update the tokens array in the database
    await set(userDataRef, { ...userData, tokens: [...tokens, token] });
  }
};

const GetUsers = async () => {
  const userDataRef = ref(db, `users`);
  const snapshot = await get(userDataRef);
  const userData = snapshot.val() ?? {};
  return userData.tokens || [];
};

const deleteToken = async (userId, tokenToDelete) => {
  const userDataRef = ref(db, `users/${userId}`);
  const snapshot = await get(userDataRef);
  const userData = snapshot.val() ?? {};
  // If user has tokens and the token to delete exists, remove it
  if (userData.tokens && userData.tokens.includes(tokenToDelete)) {
    const updatedTokens = userData.tokens.filter(
      (token) => token !== tokenToDelete
    );
    // Update the tokens array in the database
    await set(userDataRef, { ...userData, tokens: updatedTokens });
  }
};

module.exports = {
  app,
  saveToken,
  GetUsers,
  deleteToken,
};
