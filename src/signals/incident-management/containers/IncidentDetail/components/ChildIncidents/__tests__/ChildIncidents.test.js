import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';

import IncidentDetailContext from '../../../context';
import ChildIncidents from '..';

const renderWithContext = (incident = incidentFixture) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident }}>
      <ChildIncidents />
    </IncidentDetailContext.Provider>
  );
describe('signals/management/containers/IncidentDetail/components/ChildIncidents', () => {
  it('should not render anything', () => {
    const { queryByText, queryByTestId } = render(renderWithContext({}));

    expect(queryByText('Deelmelding')).not.toBeInTheDocument();
    expect(queryByTestId('childIncidents')).not.toBeInTheDocument();
  });

  it('should render correctly', () => {
    const { getByText, getByTestId } = render(renderWithContext());

    expect(getByText('Deelmelding')).toBeInTheDocument();
    expect(getByTestId('childIncidents')).toBeInTheDocument();
  });
});
