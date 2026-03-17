module.exports = {
  // Threads helpers
  runOnUISync: (fn) => fn(),
  runOnUI: (fn) => (...args) => fn(...args),
  runOnUIAsync: (fn) => Promise.resolve().then(() => fn()),
  runOnJS: (fn) => (...args) => fn(...args),

  // Shareable / serializable stubs (used by Reanimated internals)
  makeShareable: (value) => value,
  createSerializable: (value) => value,
  isSerializableRef: () => false,
  registerCustomSerializable: () => {},

  isWorkletFunction: () => false,
};
