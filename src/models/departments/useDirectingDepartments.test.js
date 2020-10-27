import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import * as departmentsSelectors from 'models/departments/selectors';
import * as reactRedux from 'react-redux';
import { departments } from 'utils/__tests__/fixtures';
import useDirectingDepartments from './useDirectingDepartments';

describe('useDirectingDepartments', () => {
  it('should return the directing departments', async () => {
    const departmentsList = [departments.list[0]];
    jest.spyOn(departmentsSelectors, 'makeSelectDirectingDepartments').mockImplementation(() => departmentsList);
    const store = {
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    const { Provider } = reactRedux;
    const wrapper = ({ children, ...props }) => <Provider {...props} store={store}>{children}</Provider>;
    const { result } = renderHook(() => useDirectingDepartments(), { wrapper });

    expect(result.current.length).toEqual(departmentsList.length + 1);
    const departmentCodes = result.current.map(department => department.key);
    expect(departmentCodes.includes('null')).toBeTruthy();
    expect(departmentCodes.includes(departmentsList[0].code)).toBeTruthy();
  });
});
