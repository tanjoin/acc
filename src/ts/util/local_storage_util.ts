module LocalStorageUtils {
  const KEY_LAST_VIEWED_ID = "last_viewed_id";

  export function saveLastViewedId(lastViewedId: string) {
    window.localStorage.setItem(KEY_LAST_VIEWED_ID, lastViewedId);
  }

  export function getLastViewedId() {
    return window.localStorage.getItem(KEY_LAST_VIEWED_ID);
  }
}

export default LocalStorageUtils
