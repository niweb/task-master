export const INIT_STORE = "init";
const STORAGE_KEY = "task-manager";

export const persist = store => {
  const storedState = localStorage.getItem(STORAGE_KEY);
  if (storedState) {
    store.commit(INIT_STORE, JSON.parse(storedState));
  }

  store.subscribe((mutation, state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  });
};
