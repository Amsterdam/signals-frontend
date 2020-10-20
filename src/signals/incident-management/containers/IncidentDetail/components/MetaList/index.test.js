import React from 'react';
import { fireEvent, render, cleanup, act } from '@testing-library/react';

import { string2date, string2time } from 'shared/services/string-parser';
import * as modelSelectors from 'models/departments/selectors';
import { store, withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';

import { departments } from 'utils/__tests__/fixtures';
import IncidentDetailContext from '../../context';
import MetaList from '.';

jest.mock('shared/services/string-parser');

store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

const update = jest.fn();
const edit = jest.fn();

const plainLinks = Object.keys(incidentFixture._links).filter(link => !['sia:children', 'sia:parent'].includes(link)).reduce((acc, key) => ({ ...acc, [key]: { ...incidentFixture._links[key] } }), {});
const plainIncident = { ...incidentFixture, _links: { ...plainLinks } };
const parentIncident = { ...incidentFixture };
const childIncident = { ...plainIncident, _links: { ...plainLinks, 'sia:parent': { href: 'http://parent-link' } } };

const renderWithContext = (props, incident = plainIncident) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident, update, edit }}>
      <MetaList {...props} />
    </IncidentDetailContext.Provider>
  );

describe('<MetaList />', () => {
  let props;

  beforeEach(() => {
    update.mockReset();
    edit.mockReset();
    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:56');
  });

  afterEach(cleanup);

  describe('rendering', () => {
    it('should render correctly a plain incident', () => {
      const { queryByTestId, queryByText } = render(renderWithContext(props));

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

      expect(queryByTestId('meta-list-directing_departments-definition')).not.toBeInTheDocument();
    });

    it('should render correctly a parent incident', () => {
      const { queryByTestId, queryByText } = render(renderWithContext(props, parentIncident));

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

      expect(queryByTestId('meta-list-directing_departments-definition')).toBeInTheDocument();
    });

    it('should render correctly a child incident', () => {
      const { queryByTestId, queryByText } = render(renderWithContext(props, childIncident));

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

      expect(queryByTestId('meta-list-directing_departments-definition')).not.toBeInTheDocument();
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

    describe('update directing departmens', () => {
      it('should update for directing department to ASC', async () => {
        jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => ({ ...departments }));
        const { getAllByTestId, getByTestId } = render(
          renderWithContext(props, parentIncident)
        );

        // priority button data-testid attribute is dynamically generated in the ChangeValue component:
        const editTestId = 'editDirecting_departmentsButton';
        const submitTestId = 'submitDirecting_departmentsButton';
        const editButtons = getAllByTestId(editTestId);

        const { id } = departments.list.find(d => d.code === 'ASC');

        fireEvent.click(editButtons[0]);

        fireEvent.click(getByTestId('input-ASC'));

        const submitButtons = getAllByTestId(submitTestId);

        expect(update).not.toHaveBeenCalled();

        fireEvent.click(submitButtons[0]);

        expect(update).toHaveBeenCalledWith({
          patch: {
            directing_departments: [{ id }],
          },
          type: 'directing_departments',
        });
      });

      it('should update for directing department to directing department', async () => {
        const { id } = departments.list.find(d => d.code === 'ASC');
        jest.spyOn(modelSelectors, 'makeSelectDepartments').mockImplementation(() => ({ ...departments }));
        const { getAllByTestId, getByTestId } = render(
          renderWithContext(props, { ...parentIncident, directing_departments: [{ id }] })
        );

        // priority button data-testid attribute is dynamically generated in the ChangeValue component:
        const editTestId = 'editDirecting_departmentsButton';
        const submitTestId = 'submitDirecting_departmentsButton';
        const editButtons = getAllByTestId(editTestId);

        fireEvent.click(editButtons[0]);
        fireEvent.click(getByTestId('input-null'));

        const submitButtons = getAllByTestId(submitTestId);

        expect(update).not.toHaveBeenCalled();

        fireEvent.click(submitButtons[0]);

        expect(update).toHaveBeenCalledWith({
          patch: {
            directing_departments: [],
          },
          type: 'directing_departments',
        });
      });
    });
  });
});
