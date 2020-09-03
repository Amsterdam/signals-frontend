import { fromJS } from 'immutable';
import { inputCheckboxRolesSelector, rolesModelSelector } from './selectors';
import { initialState } from './reducer';

describe('rolesModelSelector', () => {
  it('should select the initial state', () => {
    const mockedState = fromJS({});
    expect(rolesModelSelector(mockedState)).toEqual(initialState.toJS());
  });

  it('should select the roles', () => {
    const roles = {
      list: [{ id: 42 }],
    };

    const mockedState = fromJS({
      roles,
    });
    expect(rolesModelSelector(mockedState)).toEqual(roles);
  });

  it('should select roles for checkboxes', () => {
    const roles = {
      list: [{ id: 42, name: 'role' }],
    };
    const expected = [
      {
        key: '42',
        name: 'role',
        value: 'role',
      },
    ];
    const mockedState = fromJS({ roles });

    expect(inputCheckboxRolesSelector(mockedState)).toEqual(expected);
  });
});
