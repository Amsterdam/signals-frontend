export const getListValueByKey = (list, key) => {
  const comparator = list && key ? s => s.key === key : s => !s.key;
  const item = list && list.find(comparator);
  const value = item ? item.value : 'Niet gevonden';

  return item || key ? value : false;
};
