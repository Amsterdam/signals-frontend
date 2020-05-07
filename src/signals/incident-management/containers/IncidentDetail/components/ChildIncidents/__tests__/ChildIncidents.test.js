import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import incident from 'utils/__tests__/fixtures/incident.json';

import ChildIncidents from '..';

describe('signals/management/containers/IncidentDetail/components/ChildIncidents', () => {
  it('should not render anything', () => {
    const { queryByText, queryByTestId } = render(withAppContext(<ChildIncidents incident={{}} />));

    expect(queryByText('Deelmelding')).not.toBeInTheDocument();
    expect(queryByTestId('childIncidents')).not.toBeInTheDocument();
  });

  it('should render correctly', () => {
    const { getByText, getByTestId } = render(withAppContext(<ChildIncidents incident={incident} />));

    expect(getByText('Deelmelding')).toBeInTheDocument();
    expect(getByTestId('childIncidents')).toBeInTheDocument();
  });
});
