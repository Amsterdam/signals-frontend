export const colMap = {
  id: 'id',
  is_active: 'Status',
  roles: 'Rol',
  username: 'Gebruikersnaam',
};

const filterData = data => {
  const allowedKeys = Object.keys(colMap);

  return data.map(item =>
    Object.keys(item)
      .filter(key => allowedKeys.includes(key)) // only handle values of valid key entries
      .reduce((rawObj, key) => {
        const obj = { ...rawObj };
        let value = Array.isArray(item[key]) // join array values by a comma
          ? item[key].join(', ')
          : item[key];

        // convert boolean value to text
        if (typeof value === 'boolean') {
          value = value ? 'Actief' : 'Niet actief';
        }

        obj[colMap[key]] = value;

        return obj;
      }, {})
  );
};

export default filterData;
