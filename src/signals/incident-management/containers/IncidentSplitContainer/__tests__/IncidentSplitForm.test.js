import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { withAppContext } from 'test/utils';

import * as modelSelectors from 'models/categories/selectors';

import categoriesFixture from 'utils/__tests__/fixtures/categories_private.json';

import IncidentSplitForm from '../IncidentSplitForm';

const parentIncident = {
  id: 6010,
  status: 'm',
  statusDisplayName: 'Gemeld',
  priority: 'normal',
  subcategory: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/onderhoud-stoep-straat-en-fietspad',
  subcategoryDisplayName: 'STW',
  description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
  type: 'SIG',
};

const subcategories = categoriesFixture.results
  .filter(modelSelectors.filterForSub)
  // mapping subcategories to prevent a warning about non-unique keys rendered by the SelectInput element 🙄
  .map(subcategory => ({ ...subcategory, value: subcategory.name, key: subcategory._links.self.href }));

describe('<IncidentSplitForm />', () => {
  const onSubmit = jest.fn();

  let props;

  beforeEach(() => { props = { parentIncident, subcategories, onSubmit }; });

  it('should render correctly', () => {
    const { queryAllByText } = render(withAppContext(<IncidentSplitForm {...props} />));

    expect(queryAllByText(parentIncident.description)).toHaveLength(1);
  });

  it('should handle submit', async () => {
    const { getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));

    fireEvent.click(getByTestId('incidentSplitFormSplitButton'));

    await act(async () => { fireEvent.submit(getByTestId('incidentSplitFormSubmitButton')); });

    expect(onSubmit).toHaveBeenCalledWith({
      department: 'null',
      incidents: [
        undefined,
        {
          description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
        {
          description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
      ],
    });
  });

  // it('should handle empty incidents', () => {
  //   const { getByTestId, queryAllByText } = render(withAppContext(<IncidentSplitForm {...props} incident={null} />));

  //   expect(queryAllByText(incident.text)).toHaveLength(0);

  //   act(() => { fireEvent.click(getByTestId('incidentSplitFormSubmitButton')); });
  //   expect(props.onSubmit).not.toHaveBeenCalled();
  // });

  // it('should handle cancel', () => {
  //   const { getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));

  //   act(() => { fireEvent.click(getByTestId('splitFormCancel')); });
  //   expect(props.onHandleCancel).toHaveBeenCalled();
  // });
});
