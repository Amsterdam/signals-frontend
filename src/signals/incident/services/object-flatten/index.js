// based on source: https://30secondsofcode.org/object#flattenobject
const flattenObject = (obj, prefix = '', separator = '.') =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + separator : '';
    if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k, separator));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});

export default flattenObject;
