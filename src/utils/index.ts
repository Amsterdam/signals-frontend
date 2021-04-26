/**
 * Array detector
 *
 * @param {Any} value
 * @returns {Boolean}
 */
export const isArray = (value: unknown): boolean => !!value && Array.isArray(value);

/**
 * Date detector
 *
 * @param {Any} value
 * @returns {Boolean}
 */
export const isDate = (value: unknown) => !!value && !isArray(value) && !Number.isNaN(Date.parse(value as string));
