// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withAppContext } from 'test/utils';

import { subcategoriesGroupedByCategories as subcategories } from 'utils/__tests__/fixtures';
import parentIncidentFixture from '../../../__tests__/parentIncidentFixture.json';

import IncidentSplitFormIncident from '..';

describe('IncidentSplitFormIncident', () => {
  const register = jest.fn();
  const props = { parentIncident: parentIncidentFixture, subcategories, register, errors: {} };

  it('renders one splitted incident by default', () => {
    render(withAppContext(<IncidentSplitFormIncident {...props} />));

    expect(screen.queryAllByTestId('incidentSplitFormIncidentTitle')[0]).toHaveTextContent(/^Deelmelding 1$/);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should split incidents until limit is reached then it should hide incident split button', () => {
    global.window.HTMLElement.prototype.scrollIntoView = jest.fn();
    render(withAppContext(
      <IncidentSplitFormIncident {...props} />)
    );

    expect(screen.getAllByRole('textbox')).toHaveLength(1);

    const button = screen.getByTestId('incidentSplitFormIncidentSplitButton');

    Array(10 - 1).fill().forEach((_, index) => {
      fireEvent.click(button);

      const splittedIncidentCount = index + 2;
      if (splittedIncidentCount < 10) expect(screen.getByTestId('incidentSplitFormIncidentSplitButton')).toBeInTheDocument();
      expect(screen.getAllByRole('textbox')).toHaveLength(splittedIncidentCount);
    });

    expect(screen.queryByTestId('incidentSplitFormIncidentSplitButton')).not.toBeInTheDocument();

    expect(screen.queryAllByTestId('incidentSplitFormIncidentTitle')[9]).toHaveTextContent(/^Deelmelding 10$/);
    delete global.window.HTMLElement.prototype.scrollIntoView;
  });

  it('should render incident split form when parent already has split incidents', () => {
    const parentIncidentWithChildCount = {
      ...parentIncidentFixture,
      childrenCount: 3,
    };
    render(withAppContext(<IncidentSplitFormIncident {...props} parentIncident={parentIncidentWithChildCount} />));

    expect(screen.getAllByRole('heading', { name: /^Deelmelding \d+$/ })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Deelmelding 4' })).toBeInTheDocument();
  });

  it('should scroll new incident into view', () => {
    const scrollIntoView = jest.fn();
    global.window.HTMLElement.prototype.scrollIntoView = scrollIntoView;
    render(withAppContext(<IncidentSplitFormIncident {...props} />));

    expect(scrollIntoView).not.toHaveBeenCalled();

    const addIncidentButton = screen.getByRole('button', { name: 'Extra deelmelding toevoegen' });
    fireEvent.click(addIncidentButton);

    expect(scrollIntoView).toHaveBeenCalledTimes(1);

    delete global.window.HTMLElement.prototype.scrollIntoView;
  });

  it('should show error when form is invalid', () => {
    render(
      withAppContext(
        <IncidentSplitFormIncident
          {...props}
          errors={{ incidents: [{}, { description: { message: 'required' } }] }}
        />
      )
    );

    expect(screen.getByText('required')).toBeInTheDocument();
  });
});
