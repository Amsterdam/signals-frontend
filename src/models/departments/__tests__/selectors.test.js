import { fromJS } from 'immutable';

import departmentsJson from 'utils/__tests__/fixtures/departments.json';

import { initialState } from '../reducer';
import {
  selectDepartmentsDomain,
  makeSelectDepartments,
  filterData,
} from '../selectors';

const intermediateState = fromJS({
  count: 9,
  error: false,
  errorMessage: false,
  list: departmentsJson.results.slice(0, 9),
  loading: false,
});

describe('models/departments/selectors', () => {
  test('selectDepartmentsDomain', () => {
    expect(selectDepartmentsDomain()).toEqual(initialState);

    const departmentsDomain = fromJS({
      departments: intermediateState.toJS(),
    });
    expect(selectDepartmentsDomain(departmentsDomain)).toEqual(intermediateState);
  });

  test('makeSelectDepartments', () => {
    expect(makeSelectDepartments.resultFunc(initialState)).toEqual(
      initialState.toJS()
    );

    const result = intermediateState.toJS();
    result.list = filterData(result.list);

    expect(makeSelectDepartments.resultFunc(intermediateState)).toEqual(result);
  });

  describe('filterData', () => {
    const data = [
      {
        id: 123,
        _display: 'foo',
        bar: 'baz',
        category_names: ['foo', 'bar', 'baz'],
      },
      { id: 456, _display: 'baz', qux: 'baz', category_names: [] },
    ];
    const filteredData = filterData(data);
    const keys = Array.from(
      new Set(filteredData.flatMap(obj => Object.keys(obj)))
    );

    it('should filter out invalid keys', () => {
      expect(keys.includes('bar')).toEqual(false);
      expect(keys.includes('qux')).toEqual(false);
    });

    it('should map keys', () => {
      expect(keys.includes('Naam')).toEqual(true);
      expect(keys.includes('_display')).toEqual(false);

      expect(keys.includes('Categorie')).toEqual(true);
      expect(keys.includes('category_names')).toEqual(false);
    });

    it('should concatenate string values from an array', () => {
      expect(filteredData[0].Categorie).toEqual(
        data[0].category_names.join(', ')
      );
    });
  });
});
