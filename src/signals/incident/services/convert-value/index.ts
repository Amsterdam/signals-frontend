import { isArray } from 'utils';

const convertValue = (value: unknown = undefined, postPropertyNames: string[] = []): any => {
  if (value === 0) {
    return 0;
  }

  if (value === true) {
    return 'ja';
  }

  if (value === false) {
    return 'nee';
  }

  // when property names are specified, create an array with objects with only those properties
  if (isArray(value) && postPropertyNames.length) {
    return (value as []).map((item: any) => Object.entries(item).reduce((acc, [key, itemValue]) => {
      if (postPropertyNames.includes(key)) return ({ ...acc, [key]: itemValue });
      return { ...acc };
    }, {}));
  }

  return value;
};

export default convertValue;
