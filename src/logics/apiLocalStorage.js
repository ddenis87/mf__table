export default {
  getValue(key) {
    return localStorage.getItem(key) || null;
  },

  setValue(key, value) {
    localStorage.setItem(key, value);
  },

  deleteValue(key) {
    delete localStorage[key];
  },
};
