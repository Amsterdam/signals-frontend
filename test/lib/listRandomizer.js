import { random } from 'lodash';

const pickRandomElement = (list) => list[random(list.length - 1)];

const pickRandomSublist = (list, resultLength) => {
  console.log(resultLength);// eslint-disable-line no-console
  const maxLength = resultLength || list.length - 1;
  const length = random(maxLength - 1);
  const resultList = [];
  for (let i = 0; i < length; ++i) { // eslint-disable-line no-plusplus
    resultList.push(pickRandomElement(list));
  }
  return resultList;
};

export default {
  pickRandomElement,
  pickRandomSublist
};
