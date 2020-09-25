import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import IncidentSplitFormIncident from '../IncidentSplitFormIncident';

import parentIncidentFixture from './parentIncidentFixture.json';

import { subcategories } from './transformer';

describe('IncidentSplitFormIncident', () => {
  const register = jest.fn();
  const props = { parentIncident: parentIncidentFixture, subcategories, register };

  it('renders one splitted incident by default', () => {
    const { queryAllByTestId } = render(withAppContext(<IncidentSplitFormIncident {...props} />));

    expect(queryAllByTestId('splittedIncidentTitle')[0]).toHaveTextContent(/^Deelmelding 1$/);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should split incidents until limit is reached then it should hide incident split button', () => {
    const { getByTestId, queryAllByTestId, queryByTestId } = render(withAppContext(
      <IncidentSplitFormIncident {...props} />)
    );

    expect(screen.getAllByRole('textbox')).toHaveLength(1);

    const button = getByTestId('incidentSplitFormSplitButton');

    Array(10 - 1).fill().forEach((_, index) => {
      fireEvent.click(button);

      const splittedIncidentCount = index + 2;
      if (splittedIncidentCount < 10) expect(getByTestId('incidentSplitFormSplitButton')).toBeInTheDocument();
      expect(screen.getAllByRole('textbox')).toHaveLength(splittedIncidentCount);
    });

    expect(queryByTestId('incidentSplitFormSplitButton')).not.toBeInTheDocument();

    expect(queryAllByTestId('splittedIncidentTitle')[9]).toHaveTextContent(/^Deelmelding 10$/);
  });
});
