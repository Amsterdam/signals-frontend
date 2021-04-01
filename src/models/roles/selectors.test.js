// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable';
import { rolesModelSelector, inputCheckboxRolesSelector, inputSelectRolesSelector } from './selectors';
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

    const mockedState = {
      roles: fromJS(roles),
    };
    expect(rolesModelSelector(mockedState)).toEqual(roles);
  });

  test('inputSelectRolesSelector', () => {
    const roles = {
      list: [
        { id: 42, name: 'Role 42' },
        { id: 425, name: 'Role 425' },
      ],
    };

    const mockedState = {
      roles: fromJS(roles),
    };
    const result = [
      { key: 'all', name: 'Alles', value: '*' },
      { key: '42', name: 'Role 42', value: 'Role 42' },
      { key: '425', name: 'Role 425', value: 'Role 425' },
    ];

    expect(inputSelectRolesSelector(mockedState)).toEqual(result);
  });

  test('inputCheckboxRolesSelector', () => {
    const roles = {
      list: [
        { id: 42, name: 'Role 42' },
        { id: 425, name: 'Role 425' },
      ],
    };

    const mockedState = {
      roles: fromJS(roles),
    };

    const result = [
      { key: '42', name: 'Role 42', value: 'Role 42' },
      { key: '425', name: 'Role 425', value: 'Role 425' },
    ];

    expect(inputCheckboxRolesSelector(mockedState)).toEqual(result);
  });
});
