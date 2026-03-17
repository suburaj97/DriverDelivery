module.exports = {
  getFirestore: () => ({
    collection: () => ({
      doc: () => ({
        set: async () => {},
        get: async () => ({ exists: false, data: () => undefined }),
        update: async () => {},
      }),
      add: async () => {},
      where: () => ({
        get: async () => ({ docs: [], empty: true }),
      }),
      get: async () => ({ docs: [], empty: true }),
    }),
  }),
  serverTimestamp: () => new Date().toISOString(),
};

