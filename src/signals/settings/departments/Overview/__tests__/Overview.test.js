import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import departmentsJson from 'utils/__tests__/fixtures/departments.json';

import DepartmentOverview, { DepartmentOverviewContainer } from '..';

const departments = { ...departmentsJson, list: departmentsJson.results, results: undefined };

describe('signals/settings/departments/Overview', () => {
  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<DepartmentOverview />));

    const containerProps = tree
      .find(DepartmentOverviewContainer)
      .props();

    expect(containerProps.departments).not.toBeUndefined();
  });

  it('should show a loading indicator while loading', () => {
    const { queryByTestId, rerender } = render(withAppContext(<DepartmentOverviewContainer departments={{ ...departments, loading: true }} />));

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();

    rerender(withAppContext(<DepartmentOverviewContainer departments={{ ...departments, loading: false }} />));

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
  });

  it('should render a title', () => {
    const { getByText, rerender } = render(withAppContext(<DepartmentOverviewContainer />));

    expect(getByText('Afdelingen')).toBeInTheDocument();

    rerender(withAppContext(<DepartmentOverviewContainer departments={departments} />));

    expect(getByText(`Afdelingen (${departments.count})`)).toBeInTheDocument();
  });

  it('should render a list', () => {
    const { container, rerender } = render(withAppContext(<DepartmentOverviewContainer />));

    expect(container.querySelector('table')).not.toBeInTheDocument();

    rerender(withAppContext(<DepartmentOverviewContainer departments={{ ...departments, loading: true }} />));

    expect(container.querySelector('table')).not.toBeInTheDocument();

    rerender(withAppContext(<DepartmentOverviewContainer departments={{ ...departments, loading: false }} />));

    expect(container.querySelector('table')).toBeInTheDocument();
  });
});
