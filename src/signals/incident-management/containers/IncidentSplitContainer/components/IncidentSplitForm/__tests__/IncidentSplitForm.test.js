import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import { subcategoriesGroupedByCategories as subcategories, departments } from 'utils/__tests__/fixtures';
import parentIncidentFixture from '../../../__tests__/parentIncidentFixture.json';

import IncidentSplitForm from '..';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: mockHistoryPush }),
}));

const directingDepartments = [
  { key: 'null', value: 'Verantwoordelijke afdeling' },
  { key: departments.list[0].code, value: departments.list[0].code },
];

describe('IncidentSplitForm', () => {
  const onSubmit = jest.fn();
  const props = {
    parentIncident: parentIncidentFixture,
    subcategories,
    directingDepartments,
    onSubmit,
    isSaving: false,
  };

  it('should render correctly', () => {
    const { container, queryAllByText } = render(withAppContext(<IncidentSplitForm {...props} />));
    expect(queryAllByText(parentIncidentFixture.description)).toHaveLength(1);
    expect(container.querySelector('input[value="null"]').checked).toBe(true);
  });

  it('should render correctly with selected directing department', () => {
    const directingDepartment = departments.list[0].code;
    const parentIncident = { ...props.parentIncident, directingDepartment };
    const { container } = render(withAppContext(<IncidentSplitForm {...props} parentIncident={parentIncident} />));
    expect(container.querySelector(`input[value="${directingDepartment}"]`).checked).toBe(true);
  });

  it('should handle submit', async () => {
    const { findByTestId, getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));
    // scrollIntoView is called in <IncidentSplitFormIncident /> when split button is clicked.
    global.window.HTMLElement.prototype.scrollIntoView = jest.fn();

    fireEvent.click(getByTestId('incidentSplitFormIncidentSplitButton'));
    fireEvent.submit(getByTestId('incidentSplitFormSubmitButton'));

    await findByTestId('incidentSplitForm');

    expect(onSubmit).toHaveBeenCalledWith({
      department: parentIncidentFixture.directingDepartment,
      incidents: [
        undefined,
        {
          subcategory: parentIncidentFixture.subcategory,
          description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
        {
          subcategory: parentIncidentFixture.subcategory,
          description: 'Het wegdek van de oprit naar ons hotel is kapot. Kunnen jullie dit snel maken?',
          priority: 'normal',
          type: 'SIG',
        },
      ],
      noteText: '',
    });
  });

  it('should handle cancel', async () => {
    const { findByTestId, getByTestId } = render(withAppContext(<IncidentSplitForm {...props} />));
    fireEvent.click(getByTestId('incidentSplitFormCancelButton'));

    await findByTestId('incidentSplitForm');
    expect(mockHistoryPush).toHaveBeenCalledWith('/manage/incident/6010');
  });

  it('should disable buttons when saving', () => {
    const { container, rerender } = render(withAppContext(<IncidentSplitForm {...props} />));

    expect(screen.getByTestId('incidentSplitFormSubmitButton')).not.toHaveAttribute('disabled');
    expect(screen.getByTestId('incidentSplitFormCancelButton')).not.toHaveAttribute('disabled');

    rerender(withAppContext(<IncidentSplitForm {...props} isSaving />));
    expect(screen.getByTestId('incidentSplitFormSubmitButton')).toHaveAttribute('disabled');
    expect(screen.getByTestId('incidentSplitFormCancelButton')).toHaveAttribute('disabled');
  });
});
