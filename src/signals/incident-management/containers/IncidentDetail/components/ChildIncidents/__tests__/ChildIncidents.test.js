import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import childIncidentsFixture from 'utils/__tests__/fixtures/childIncidents.json';

import ChildIncidents from '..';

describe('signals/management/containers/IncidentDetail/components/ChildIncidents', () => {
  it('should not render anything', () => {
    const childIncidents = [];
    const { queryByText, queryByTestId } = render(withAppContext(<ChildIncidents incidents={childIncidents} />));

    expect(queryByText('Deelmelding')).not.toBeInTheDocument();
    expect(queryByTestId('childIncidents')).not.toBeInTheDocument();
  });

  it('should render correctly', () => {
    const childIncidents = childIncidentsFixture.results;
    const { getByTestId, getByText } = render(withAppContext(<ChildIncidents incidents={childIncidents} />));

    expect(getByText('Deelmelding')).toBeInTheDocument();
    expect(getByTestId('childIncidents')).toBeInTheDocument();
  });
});
