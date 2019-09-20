import { random } from 'lodash';

export const pickRandomElement = (list) => list[random(list.length - 1)];

export const pickRandomSublist = (list, resultLength) => {
  const maxLength = resultLength || list.length - 1;
  const length = random(maxLength - 1);
  const resultList = [];
  for (let i = 0; i < length; ++i) { // eslint-disable-line no-plusplus
    resultList.push(pickRandomElement(list));
  }
  return resultList;
};

export const pickRandomDate = (start, end) => new Date(start.getTime() + (Math.random() * (end.getTime() - start.getTime())));

const listRandomizer = {
  pickRandomElement,
  pickRandomSublist,
  pickRandomDate
};

export default listRandomizer;
