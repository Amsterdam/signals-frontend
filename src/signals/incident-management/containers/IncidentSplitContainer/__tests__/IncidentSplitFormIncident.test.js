import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import categoriesFixture from 'utils/__tests__/fixtures/categories_private.json';
import { withAppContext } from 'test/utils';
import * as modelSelectors from 'models/categories/selectors';

import IncidentSplitFormIncident from '../IncidentSplitFormIncident';

const subcategories = categoriesFixture.results
  .filter(modelSelectors.filterForSub)
  // mapping subcategories to prevent a warning about non-unique keys rendered by the SelectInput element 🙄
  .map(subcategory => ({ ...subcategory, value: subcategory.name, key: subcategory._links.self.href }));

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

describe('IncidentSplitFormIncident', () => {
  const register = jest.fn();
  const control = {};

  it('renders one splitted incident by default', () => {
    const { queryAllByTestId } = render(
      withAppContext(
        <IncidentSplitFormIncident
          parentIncident={parentIncident}
          subcategories={subcategories}
          control={control}
          register={register}
        />
      )
    );

    expect(queryAllByTestId('splittedIncidentTitle')[0]).toHaveTextContent(/^Deelmelding 1$/);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should split incidents until limit is reached then it should hide incident split button', () => {
    const { getByTestId, queryAllByTestId, queryByTestId } = render(
      withAppContext(
        <IncidentSplitFormIncident
          parentIncident={parentIncident}
          subcategories={subcategories}
          control={control}
          register={register}
        />
      )
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
