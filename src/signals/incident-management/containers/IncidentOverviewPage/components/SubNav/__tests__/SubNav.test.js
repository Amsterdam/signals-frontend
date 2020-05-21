import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import SubNav from '..';

describe('signals/incident-management/containers/IncidentOverviewPage/components/SubNav', () => {
  it('should render tabbed links', () => {
    const { queryByTestId, rerender } = render(withAppContext(<SubNav />));

    expect(queryByTestId('subNavMapLink')).toBeInTheDocument();
    expect(queryByTestId('subNavListLink')).not.toBeInTheDocument();

    rerender(withAppContext(<SubNav showsMap />));

    expect(queryByTestId('subNavMapLink')).not.toBeInTheDocument();
    expect(queryByTestId('subNavListLink')).toBeInTheDocument();
  });
});
