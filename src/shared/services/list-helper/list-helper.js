// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
export const getListValueByKey = (list, key) => {
  const comparator = list && key ? s => s.key === key : s => !s.key;
  const item = list?.find(comparator);
  const value = item ? item.value : 'Niet gevonden';

  return item || key ? value : false;
};
