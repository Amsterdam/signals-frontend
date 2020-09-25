import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { subcategories } from './transformer';
import parentIncidentFixture from './parentIncidentFixture.json';

import IncidentSplitForm from '../IncidentSplitForm';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: mockHistoryPush }),
}));

describe('<IncidentSplitForm />', () => {
  const onSubmit = jest.fn();
  const props = { parentIncident: parentIncidentFixture, subcategories, onSubmit };

  it('should render correctly', () => {
    const { queryAllByText } = render(withAppContext(<IncidentSplitForm {...props} />));
    expect(queryAllByText(parentIncidentFixture.description)).toHaveLength(1);
  });

  it('should handle submit', async () => {
    const { findByTestId, getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));

    fireEvent.click(getByTestId('incidentSplitFormSplitButton'));
    fireEvent.submit(getByTestId('incidentSplitFormSubmitButton'));

    await findByTestId('incidentSplitForm');

    expect(onSubmit).toHaveBeenCalledWith({
      department: 'null',
      incidents: [
        undefined,
        {
          // WARNING: this value does not match acc and that sucks because it is confusing..
          subcategory: 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/145',
          description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
        {
          // WARNING: this value does not match acc and that sucks because it is confusing..
          subcategory: 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/145',
          description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
      ],
    });
  });

  it('should handle cancel', async () => {
    const { findByTestId, getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));
    fireEvent.click(getByTestId('incidentSplitFormCancel'));

    await findByTestId('incidentSplitForm');
    expect(mockHistoryPush).toHaveBeenCalledWith(CONFIGURATION.INCIDENTS_ENDPOINT);
  });
});
