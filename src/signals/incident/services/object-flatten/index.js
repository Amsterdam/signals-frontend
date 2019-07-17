/**
 * Flattens a nested object to a one level deep object (simple map/dictionary).
 * E.g.: { foo: 1, bar: { abc: 2 }} is transformed to { foo: 1, bar.abc: 2 }
 *
 * based on source: https://30secondsofcode.org/object#flattenobject
 *
 * @param obj
 * @param prefix
 * @param separator
 * @returns object, Object of depth 1
 */
const flattenObject = (obj, prefix = '', separator = '.') =>
  Object.keys(obj).reduce((acc, k) => {
    const nested_key = prefix.length ? `${prefix}${separator}${k}` : k;
    if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], nested_key, separator));
    else acc[nested_key] = obj[k];
    return acc;
  }, {});

export default flattenObject;
