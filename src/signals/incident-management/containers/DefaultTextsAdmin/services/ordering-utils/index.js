import { orderBy } from 'lodash';

export function renumberOrder(list) {
  return list.map((item, index) => ({ ...item, order: (index + 1) * 10 }));
}

export function sortByOrder(list) {
  return orderBy(list, ['order']);
}

export function addTrailingItems(list) {
  const newList = [...list];
  const start = (list.length && list[list.length - 1].order) || 10;
  for (let order = start; order < 50; order += 10) {
    newList.push({
      order: order + 10,
      text: '',
      title: '',
    });
  }
  return newList;
}
