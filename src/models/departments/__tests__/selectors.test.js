import { fromJS } from 'immutable';

import departmentsJson from 'utils/__tests__/fixtures/departments.json';

import { initialState } from '../reducer';
import { selectDepartmentsDomain, makeSelectDepartments } from '../selectors';

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
    expect(makeSelectDepartments.resultFunc(initialState)).toEqual(initialState.toJS());

    const result = intermediateState.toJS();

    expect(makeSelectDepartments.resultFunc(intermediateState)).toEqual(result);
  });
});
