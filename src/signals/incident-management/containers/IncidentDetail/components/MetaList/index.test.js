import React from 'react';
import { fireEvent, render, cleanup, act } from '@testing-library/react';

import { string2date, string2time } from 'shared/services/string-parser';
import { store, withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';

import IncidentDetailContext from '../../context';
import MetaList from '.';

jest.mock('shared/services/string-parser');

store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

const update = jest.fn();

const renderWithContext = (props, incident = incidentFixture) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident, update }}>
      <MetaList {...props} />
    </IncidentDetailContext.Provider>
  );

describe('<MetaList />', () => {
  let props;

  beforeEach(() => {
    update.mockReset();
    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:56');
  });

  afterEach(cleanup);

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryByText } = render(renderWithContext(props));

      expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(queryByText('Urgentie')).toBeInTheDocument();
      expect(queryByText('Normaal')).toBeInTheDocument();

      expect(queryByText('Subcategorie')).toBeInTheDocument();
      expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

      expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);
    });

    it('should render correctly with high priority', () => {
      const { queryByText, container, rerender } = render(renderWithContext(props));

      expect(queryByText('Hoog')).not.toBeInTheDocument();
      expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(1);

      rerender(
        renderWithContext(props, { ...incidentFixture, priority: { ...incidentFixture.priority, priority: 'high' } })
      );

      expect(queryByText('Hoog')).toBeInTheDocument();
      expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(2);
    });

    it('should call edit', () => {
      const { queryByTestId } = render(renderWithContext(props));

      expect(edit).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(queryByTestId('editStatusButton'));
      });

      expect(edit).toHaveBeenCalled();
    });

    it('should call update', async () => {
      const { getAllByTestId } = render(
        renderWithContext(props, { ...incidentFixture, priority: { ...incidentFixture.priority, priority: 'high' } })
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
  });
});
