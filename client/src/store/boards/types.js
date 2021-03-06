/** Getters */
export const getCurrentBoardId = "GET_BOARD";
export const getRequestInProgress = "GET_REQUEST_IN_PROGRESS";
export const getExportData = "GET_EXPORT_DATA";
export const getNeedsSave = "GET_NEEDS_SAVE";

/** Mutation */
export const setCurrentBoardId = "SET_BOARD";
export const setRequestInProgress = "SET_REQUEST_IN_PROGRESS";
export const setLastSavedVersion = "SET_LAST_SAVED_VERSION";

/** Actions */
export const create = "CREATE";
export const load = "LOAD";
export const save = "SAVE";
export const remove = "REMOVE";
export const internalRequest = "INTERNAL/REQUEST";

export const importData = "IMPORT_DATA";
export const resetData = "RESET_DATA";
export const updateLastSavedVersion = "UPDATE_LAST_SAVED_VERSION";

/** Request Types */
export const requestTypes = {
  create,
  load,
  save,
  remove
};
