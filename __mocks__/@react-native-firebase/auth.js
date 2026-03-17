const noopUnsubscribe = () => {};

module.exports = {
  getAuth: () => ({ currentUser: null }),
  onAuthStateChanged: (_auth, callback) => {
    callback(null);
    return noopUnsubscribe;
  },
  signInWithEmailAndPassword: async () => ({ user: { uid: 'test', email: 'test@example.com' } }),
  createUserWithEmailAndPassword: async () => ({ user: { uid: 'test', email: 'test@example.com' } }),
  signOut: async () => {},
};

