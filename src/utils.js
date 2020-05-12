export const generateNewId = currentIds => {
  const ids = currentIds.map(id => Number(id));
  const maxId = Math.max(...ids) || 0;
  return maxId + 1;
};
