import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, waitForElement, act } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';

import { withAppContext } from 'test/utils';
import departmentsJson from 'utils/__tests__/fixtures/departments.json';
import { DEPARTMENT_URL } from 'signals/settings/routes';

import DepartmentOverview, { DepartmentOverviewContainer } from '..';

const departments = {
  ...departmentsJson,
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

describe('signals/settings/departments/Overview', () => {
  beforeEach(() => {
    push.mockReset();
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<DepartmentOverview />));

    const containerProps = tree.find(DepartmentOverviewContainer).props();

    expect(containerProps.departments).not.toBeUndefined();
  });

  it('should show a loading indicator while loading', () => {
    const { queryByTestId, rerender } = render(
      withAppContext(
        <DepartmentOverviewContainer
          departments={{ ...departments, loading: true }}
          userCan={() => {}}
        />
      )
    );

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();

    rerender(
      withAppContext(
        <DepartmentOverviewContainer
          departments={{ ...departments, loading: false }}
          userCan={() => {}}
        />
      )
    );

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('should render a title', () => {
    const { getByText, rerender } = render(
      withAppContext(<DepartmentOverviewContainer userCan={() => {}} />)
    );

    expect(getByText('Afdelingen')).toBeInTheDocument();

    rerender(
      withAppContext(
        <DepartmentOverviewContainer
          departments={departments}
          userCan={() => {}}
        />
      )
    );

    expect(getByText(`Afdelingen (${departments.count})`)).toBeInTheDocument();
  });

  it('should render a list', () => {
    const { container, rerender } = render(
      withAppContext(<DepartmentOverviewContainer userCan={() => {}} />)
    );

    expect(container.querySelector('table')).not.toBeInTheDocument();

    rerender(
      withAppContext(
        <DepartmentOverviewContainer
          departments={{ ...departments, loading: true }}
          userCan={() => {}}
        />
      )
    );

    expect(container.querySelector('table')).not.toBeInTheDocument();

    rerender(
      withAppContext(
        <DepartmentOverviewContainer
          departments={{ ...departments, loading: false }}
          userCan={() => {}}
        />
      )
    );

    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('should push on list item click', async () => {
    const { id } = departmentsJson.results[12];
    const { container } = render(
      withAppContext(
        <DepartmentOverviewContainer
          departments={{ ...departments, loading: false }}
          userCan={() => true}
        />
      )
    );

    const row = await waitForElement(
      () => container.querySelector(`tr[data-item-id="${id}"]`),
      { container }
    );

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
    const { id } = departmentsJson.results[9];
    const { container } = render(
      withAppContext(
        <DepartmentOverviewContainer
          departments={{ ...departments, loading: false }}
          userCan={() => false}
        />
      )
    );

    const row = await waitForElement(
      () => container.querySelector(`tr[data-item-id="${id}"]`),
      { container }
    );

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = id;

    expect(push).toHaveBeenCalledTimes(0);

    act(() => {
      fireEvent.click(row);
    });
    expect(push).not.toHaveBeenCalled();
  });
});
