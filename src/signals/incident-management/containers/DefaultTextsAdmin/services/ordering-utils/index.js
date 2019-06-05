import orderBy from 'lodash.orderby';

export function renumberOrder(list) {
  return list.map((item, index) => ({ ...item, order: (index + 1) * 10 }));
}

export function sortByOrder(list) {
  return orderBy(list, ['order']);
}
