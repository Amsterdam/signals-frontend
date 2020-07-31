import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';

import { withAppContext } from 'test/utils';
import departmentsJson from 'utils/__tests__/fixtures/departments.json';
import { DEPARTMENT_URL } from 'signals/settings/routes';

import * as modelSelectors from 'models/departments/selectors';
import * as appSelectors from 'containers/App/selectors';

import DepartmentOverview from '..';

const departments = {
  ...departmentsJson,
  count: departmentsJson.count,
  list: departmentsJson.results,
  results: undefined,
};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}));

jest.mock('models/departments/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/departments/selectors'),
}));

jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => {});

describe('signals/settings/departments/Overview', () => {
  beforeEach(() => {
    push.mockReset();

    jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => ({ ...departments, loading: false }));
  });

  it('should show a loading indicator while loading', () => {
    jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => ({ ...departments, loading: true }));

    const { queryByTestId } = render(withAppContext(<DepartmentOverview />));

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
  });

  it('should not show a loading indicator when data has loaded', () => {
    const { queryByTestId } = render(withAppContext(<DepartmentOverview />));

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('should render a title', () => {
    jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => ({ list: [], loading: true }));

    const { getByText } = render(withAppContext(<DepartmentOverview />));

    expect(getByText('Afdelingen')).toBeInTheDocument();
  });

  it('should render a title when departments are loaded', () => {
    const { getByText } = render(withAppContext(<DepartmentOverview />));

    expect(getByText(`Afdelingen (${departments.count})`)).toBeInTheDocument();
  });

  it('should render a list', () => {
    const { container, rerender, unmount } = render(withAppContext(<DepartmentOverview />));

    expect(container.querySelector('table')).toBeInTheDocument();

    jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => ({ list: [], loading: true }));

    unmount();

    rerender(withAppContext(<DepartmentOverview />));

    expect(container.querySelector('table')).not.toBeInTheDocument();
  });

  it('should push on list item click', async () => {
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => true);

    const { id } = departmentsJson.results[12];
    const { container } = render(withAppContext(<DepartmentOverview />));

    let row;

    await waitFor(() => {
      row = container.querySelector(`tr[data-item-id="${id}"]`);
    });

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = id;

    expect(push).toHaveBeenCalledTimes(0);

    act(() => {
      fireEvent.click(row);
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(`${DEPARTMENT_URL}/${id}`);

    // Remove 'itemId' and fire click event again.
    delete row.dataset.itemId;

    act(() => {
      fireEvent.click(row);
    });

    expect(push).toHaveBeenCalledTimes(1);

    // Set 'itemId' again and fire click event once more.
    row.dataset.itemId = id;

    act(() => {
      fireEvent.click(row);
    });

    expect(push).toHaveBeenCalledTimes(2);
  });

  it('should not push on list item click when permissions are insufficient', async () => {
    jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(() => () => false);
    const { id } = departmentsJson.results[9];
    const { container } = render(withAppContext(<DepartmentOverview />));

    let row;

    await waitFor(() => {
      row = container.querySelector(`tr[data-item-id="${id}"]`);
    });

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = id;

    expect(push).toHaveBeenCalledTimes(0);

    act(() => {
      fireEvent.click(row);
    });
    expect(push).not.toHaveBeenCalled();
  });
});
