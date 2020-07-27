/**
 * Clean-up of API response
 *
 * Filtering out invalid keys, turning array values into concatenated strings and
 * converting boolean values to readable text values
 *
 * @param {Object} data
 * @returns {Object}
 */
const filterData = (data, colMap) => {
  const allowedKeys = Object.keys(colMap);

  return data.map(item =>
    Object.keys(item)
      .filter(key => allowedKeys.includes(key))
      .reduce((rawObj, key) => {
        const obj = { ...rawObj };
        let value = Array.isArray(item[key]) ?
          item[key].join(', ') :
          item[key];

        if (typeof value === 'boolean') {
          value = value ? 'Actief' : 'Niet actief';
        }

        obj[colMap[key]] = value;

        return obj;
      }, {})
  );
};

export default filterData;
