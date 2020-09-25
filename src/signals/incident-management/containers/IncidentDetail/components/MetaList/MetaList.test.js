import React from 'react';
import { fireEvent, render, cleanup, act } from '@testing-library/react';

import configuration from 'shared/services/configuration/configuration';
import { string2date, string2time } from 'shared/services/string-parser';
import { store, withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import usersFixture from 'utils/__tests__/fixtures/users.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';

import IncidentDetailContext from '../../context';
import IncidentManagementContext from '../../../../context';
import MetaList from '.';

jest.mock('shared/services/configuration/configuration');
jest.mock('shared/services/string-parser');

store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

const update = jest.fn();
const edit = jest.fn();

const renderWithContext = (incident = incidentFixture, users = usersFixture.results) =>
  withAppContext(
    <IncidentManagementContext.Provider value={{ users }}>
      <IncidentDetailContext.Provider value={{ incident, update, edit }}>
        <MetaList />
      </IncidentDetailContext.Provider>
    </IncidentManagementContext.Provider>
  );

describe('MetaList', () => {
  beforeEach(() => {
    update.mockReset();
    edit.mockReset();
    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:56');
  });

  afterEach(() => {
    cleanup();
    configuration.__reset();
  });

  it('should render correctly', () => {
    const { queryByTestId, queryByText } = render(renderWithContext());

    expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
    expect(queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

    expect(queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
    expect(queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

    expect(queryByText('Urgentie')).toBeInTheDocument();
    expect(queryByText('Normaal')).toBeInTheDocument();

    expect(queryByText('Subcategorie (verantwoordelijke afdeling)')).toBeInTheDocument();
    expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
    expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

    expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
    expect(queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);
  });

  it('should render correctly with high priority', () => {
    const { queryByText, container, rerender } = render(renderWithContext());

    expect(queryByText('Hoog')).not.toBeInTheDocument();
    expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(1);

    rerender(renderWithContext({ ...incidentFixture, priority: { ...incidentFixture.priority, priority: 'high' } }));

    expect(queryByText('Hoog')).toBeInTheDocument();
    expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(2);
  });

  it('should call edit', () => {
    const { queryByTestId } = render(renderWithContext());

    expect(edit).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(queryByTestId('editStatusButton'));
    });

    expect(edit).toHaveBeenCalled();
  });

  it('should call update', () => {
    const { getAllByTestId } = render(
      renderWithContext({ ...incidentFixture, priority: { ...incidentFixture.priority, priority: 'high' } })
    );

    // priority button data-testid attribute is dynamically generated in the ChangeValue component:
    const editTestId = 'editPriorityButton';
    const submitTestId = 'submitPriorityButton';
    const editButtons = getAllByTestId(editTestId);

    act(() => {
      fireEvent.click(editButtons[0]);
    });

    const submitButtons = getAllByTestId(submitTestId);

    expect(update).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(submitButtons[0]);
    });

    expect(update).toHaveBeenCalledWith({
      patch: {
        priority: {
          priority: 'high',
        },
      },
      type: 'priority',
    });
  });

  describe('assign user', () => {
    it('should not show assigned user by default', () => {
      const { queryByTestId } = render(renderWithContext());

      expect(queryByTestId('meta-list-assigned_user_id-definition')).not.toBeInTheDocument();
      expect(queryByTestId('meta-list-assigned_user_id-value')).not.toBeInTheDocument();
    });

    it('should show assigned user with assignSignalToEmployee enabled', () => {
      configuration.assignSignalToEmployee = true;

      const { queryByText, queryByTestId } = render(renderWithContext());

      expect(queryByTestId('meta-list-assigned_user_id-definition')).toBeInTheDocument();
      expect(queryByTestId('meta-list-assigned_user_id-value')).toBeInTheDocument();
      expect(queryByText('Niet toegewezen')).toBeInTheDocument();
    });

    it('should show username when assigned', () => {
      configuration.assignSignalToEmployee = true;

      const { queryByText } = render(
        renderWithContext({
          ...incidentFixture,
          assigned_user_id: usersFixture.results[0].id,
        })
      );

      expect(queryByText('Niet toegewezen')).not.toBeInTheDocument();
      expect(queryByText(usersFixture.results[0].username)).toBeInTheDocument();
    });

    it('should not show assigned user when users not defined', () => {
      configuration.assignSignalToEmployee = true;

      const { queryByTestId } = render(renderWithContext(incidentFixture, null));

      expect(queryByTestId('meta-list-assigned_user_id-definition')).not.toBeInTheDocument();
      expect(queryByTestId('meta-list-assigned_user_id-value')).not.toBeInTheDocument();
    });
  });
});
