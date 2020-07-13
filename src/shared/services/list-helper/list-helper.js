export const getListValueByKey = (list, key) => {
  if (list && key) {
    const item = list.find(s => s.key === key);
    return item ? item.value : 'Niet gevonden';
  }

  return false;
};
