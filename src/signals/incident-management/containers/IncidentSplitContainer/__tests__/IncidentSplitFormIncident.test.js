import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import categoriesFixture from 'utils/__tests__/fixtures/categories_private.json';
import * as modelSelectors from 'models/categories/selectors';

import IncidentSplitFormIncident from '../IncidentSplitFormIncident';

const subcategories = categoriesFixture.results
  .filter(modelSelectors.filterForSub)
  // mapping subcategories to prevent a warning about non-unique keys rendered by the SelectInput element 🙄
  .map(subCat => ({ ...subCat, value: subCat.name, key: subCat._links.self.href }));

const parentIncident = {
  id: 6010,
  status: 'm',
  statusDisplayName: 'Gemeld',
  priority: 'normal',
  subcategory:
    'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/onderhoud-stoep-straat-en-fietspad',
  subcategoryDisplayName: 'STW',
  description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
  type: 'SIG',
};

describe('IncidentSplitFormIncident', () => {
  it('renders one form part by default', () => {
    const register = jest.fn();
    render(
      withAppContext(
        <IncidentSplitFormIncident
          register={register}
          parentIncident={parentIncident}
          subcategories={subcategories}
        />
      )
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders multiple form parts', () => {
    const register = jest.fn();
    const { getByTestId, queryByTestId } = render(
      withAppContext(
        <IncidentSplitFormIncident
          register={register}
          parentIncident={parentIncident}
          subcategories={subcategories}
        />
      )
    );

    expect(screen.getAllByRole('textbox')).toHaveLength(1);

    const button = getByTestId('incidentSplitFormSplitButton');

    for (let i = 1; i < 10; i++) { // eslint-disable-line no-unused-vars
      fireEvent.click(button);

      if (i < 9) {
        expect(getByTestId('incidentSplitFormSplitButton')).toBeInTheDocument();
      }
      expect(screen.getAllByRole('textbox')).toHaveLength(i + 1);
    }

    expect(queryByTestId('incidentSplitFormSplitButton')).not.toBeInTheDocument();
  });
});
