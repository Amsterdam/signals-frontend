import { createSelector } from 'reselect';
import { initialState } from './reducer';

export const selectDepartmentsDomain = state => (state && state.get('departments')) || initialState;

/**
 * Clean-up of departments API response
 *
 * Filtering out invalid keys and turning array values into concatenated strings
 *
 * @param {Object} data
 * @returns {Object}
 */
export const filterData = data => {
  const colMap = {
    id: 'id',
    _display: 'Naam',
    category_names: 'Categorie',
  };

  const allowedKeys = Object.keys(colMap);

  return data.map(item =>
    Object.keys(item)
      .filter(key => allowedKeys.includes(key))
      .reduce((rawObj, key) => {
        const obj = { ...rawObj };
        const value = Array.isArray(item[key])
          ? item[key].join(', ')
          : item[key];

        obj[colMap[key]] = value;

        return obj;
      }, {})
  );
};

export const makeSelectDepartments = createSelector(
  selectDepartmentsDomain,
  state => {
    const { list, ...data } = state.toJS();

    return { ...data, list: filterData(list) };
  }
);
