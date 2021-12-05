export class StorageProvider {
  static setItem = (key, item, local = false) => {
    const preparedItem = JSON.stringify(item);
    sessionStorage.setItem(key, preparedItem);

    if (local) {
      localStorage.setItem(key, preparedItem);
    }
  };

  static getItem = (key) => {
    const item = sessionStorage.getItem(key) || localStorage.getItem(key);

    if (item) {
      const rawItem = JSON.parse(item);
      return rawItem;
    }

    return null;
  };

  static removeItem = (key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  };
}
