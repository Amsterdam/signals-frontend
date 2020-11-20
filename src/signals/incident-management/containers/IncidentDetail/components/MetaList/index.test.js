import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import configuration from 'shared/services/configuration/configuration';
import { string2date, string2time } from 'shared/services/string-parser';
import { store, withAppContext } from 'test/utils';
import {
  departments,
  directingDepartments,
  subcategoriesGroupedByCategories,
  subcategoriesHandlingTimes,
} from 'utils/__tests__/fixtures';

import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import usersFixture from 'utils/__tests__/fixtures/users.json';

import { fetchCategoriesSuccess } from 'models/categories/actions';
import * as departmentsSelectors from 'models/departments/selectors';
import * as categoriesSelectors from 'models/categories/selectors';


import IncidentDetailContext from '../../context';
import IncidentManagementContext from '../../../../context';
import MetaList from '.';

jest.mock('shared/services/configuration/configuration');
jest.mock('shared/services/string-parser');

store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

const update = jest.fn();
const edit = jest.fn();
const departmentAscId = departments.list[0].id;
const departmentAscCode = departments.list[0].code;
const departmentAscName = departments.list[0].name;
const departmentAegCode = departments.list[1].code;
const departmentAegName = departments.list[1].name;
const departmentThoId = departments.list[11].id;
const departmentThoCode = departments.list[11].code;
const departmentThoName = departments.list[11].name;
const userEmptyId = usersFixture.results[0].id;
const userEmptyName = usersFixture.results[0].username;
const userAscAegId = usersFixture.results[1].id;
const userAscAegName = usersFixture.results[1].username;
const userAscName = usersFixture.results[2].username;
const userAegName = usersFixture.results[3].username;
const userThoName = usersFixture.results[4].username;
const userUndefinedId = usersFixture.results[5].id;
const userUndefinedName = usersFixture.results[5].username;

const plainLinks = Object.keys(incidentFixture._links)
  .filter(link => !['sia:children', 'sia:parent'].includes(link))
  .reduce((acc, key) => ({ ...acc, [key]: { ...incidentFixture._links[key] } }), {});

const plainIncident = { ...incidentFixture, _links: { ...plainLinks } };
const parentIncident = { ...incidentFixture };
const childIncident = { ...plainIncident, _links: { ...plainLinks, 'sia:parent': { href: 'http://parent-link' } } };

const renderWithContext = (incident = parentIncident, users = usersFixture.results) =>
  withAppContext(
    <IncidentManagementContext.Provider value={{ users }}>
      <IncidentDetailContext.Provider
        value={{ handlingTimesBySlug: subcategoriesHandlingTimes, incident, update, edit }}
      >
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
    jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => departments);
    jest
      .spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories')
      .mockImplementation(() => subcategoriesGroupedByCategories);
  });

  afterEach(() => {
    configuration.__reset();
  });

  describe('rendering', () => {
    it('should render correctly a plain incident', () => {
      const { queryByTestId, queryByText } = render(renderWithContext(plainIncident));

      expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
      expect(queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^3 werkdagen$/);

      expect(queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(queryByText('Urgentie')).toBeInTheDocument();
      expect(queryByText('Normaal')).toBeInTheDocument();

      expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

      expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);

      expect(queryByTestId('meta-list-directing_departments-definition')).not.toBeInTheDocument();
    });

    it('should render correctly a parent incident', () => {
      const { queryByTestId, queryByText } = render(renderWithContext(parentIncident));

      expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
      expect(queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^3 werkdagen$/);

      expect(queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(queryByText('Urgentie')).toBeInTheDocument();
      expect(queryByText('Normaal')).toBeInTheDocument();

      expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

      expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);

      expect(queryByTestId('meta-list-directing_departments-definition')).toBeInTheDocument();
    });

    it('should render correctly a child incident', () => {
      const { queryByTestId, queryByText } = render(renderWithContext(childIncident));

      expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(queryByText('Urgentie')).toBeInTheDocument();
      expect(queryByText('Normaal')).toBeInTheDocument();

      expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

      expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);

      expect(queryByTestId('meta-list-directing_departments-definition')).not.toBeInTheDocument();
    });
  });

  it('should render correctly with high priority', () => {
    const { queryByText, container, rerender } = render(renderWithContext());

    expect(queryByText('Hoog')).not.toBeInTheDocument();
    expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(1);

    rerender(renderWithContext({ ...incidentFixture, priority: { ...incidentFixture.priority, priority: 'high' } }));

    expect(queryByText('Hoog')).toBeInTheDocument();
    expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(2);
  });

  it('should render days and workdays in single and plural form', () => {
    const { queryByTestId, rerender } = render(renderWithContext(plainIncident));

    expect(queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
    expect(queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^3 werkdagen$/);

    rerender(renderWithContext({ ...plainIncident, category: { sub_slug: 'beplanting' } }));
    expect(queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
    expect(queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^1 werkdag$/);

    rerender(renderWithContext({ ...plainIncident, category: { sub_slug: 'bewegwijzering' } }));
    expect(queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
    expect(queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^1 dag$/);

    rerender(renderWithContext({ ...plainIncident, category: { sub_slug: 'parkeer-verwijssysteem' } }));
    expect(queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
    expect(queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^21 dagen$/);
  });

  it('should call edit', () => {
    const { queryByTestId } = render(renderWithContext());

    expect(edit).not.toHaveBeenCalled();

    fireEvent.click(queryByTestId('editStatusButton'));

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

    fireEvent.click(editButtons[0]);

    const submitButtons = getAllByTestId(submitTestId);

    expect(update).not.toHaveBeenCalled();

    fireEvent.click(submitButtons[0]);

    expect(update).toHaveBeenCalledWith({
      patch: {
        priority: {
          priority: 'high',
        },
      },
      type: 'priority',
    });
  });

  describe('subcategory', () => {
    const subcategoryLabel = 'Subcategorie (verantwoordelijke afdeling)';
    const selectedSubcategory = `${parentIncident.category.sub} (${departmentAegCode}, ${departmentAscCode})`;

    it('should be visible', () => {
      render(renderWithContext());
      expect(screen.getByText(subcategoryLabel)).toBeInTheDocument();
      expect(screen.getByText(selectedSubcategory)).toBeInTheDocument();
    });

    it('should not be visible without subcategories available', () => {
      jest.spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories').mockImplementation(() => []);
      render(renderWithContext());

      expect(screen.queryByText(subcategoryLabel)).not.toBeInTheDocument();
      expect(screen.queryByText(selectedSubcategory)).not.toBeInTheDocument();
    });
  });

  describe('assign user', () => {
    it('should not show assigned user by default', () => {
      const { queryByTestId } = render(renderWithContext());

      expect(queryByTestId('meta-list-assigned_user_id-definition')).not.toBeInTheDocument();
      expect(queryByTestId('meta-list-assigned_user_id-value')).not.toBeInTheDocument();
    });

    it('should show assigned user with assignSignalToEmployee enabled', () => {
      configuration.featureFlags.assignSignalToEmployee = true;

      const { queryByText, queryByTestId } = render(renderWithContext());

      expect(queryByTestId('meta-list-assigned_user_id-definition')).toBeInTheDocument();
      expect(queryByTestId('meta-list-assigned_user_id-value')).toBeInTheDocument();
      expect(queryByText('Niet toegewezen')).toBeInTheDocument();
    });

    it('should not show assigned user when users not defined', () => {
      configuration.featureFlags.assignSignalToEmployee = true;

      const { queryByTestId } = render(renderWithContext(incidentFixture, null));

      expect(queryByTestId('meta-list-assigned_user_id-definition')).not.toBeInTheDocument();
      expect(queryByTestId('meta-list-assigned_user_id-value')).not.toBeInTheDocument();
    });

    describe('username', () => {
      it('should be visible', () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        const { queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_id: userAscAegId,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        );

        expect(queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should be visible even if in another department', () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        const { queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_id: userAscAegId,
            category: {
              ...incidentFixture.category,
              departments: departmentThoCode,
            },
          })
        );

        expect(queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should be visible even if not in a department', () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        const { queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_id: userEmptyId,
            category: {
              ...incidentFixture.category,
              departments: departmentThoCode,
            },
          })
        );

        expect(queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(queryByText(userEmptyName)).toBeInTheDocument();
        expect(queryByText(userAscAegName)).not.toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should be visible even if it has no departments defined', () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        const { queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_id: userUndefinedId,
            category: {
              ...incidentFixture.category,
              departments: departmentThoCode,
            },
          })
        );

        expect(queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).not.toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).toBeInTheDocument();
      });

      it('should be visible even if the category has no departments defined', () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        const { queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_id: userAscAegId,
            category: {
              ...incidentFixture.category,
            },
          })
        );

        expect(queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });
    });

    describe('available users', () => {
      beforeEach(() => {
        configuration.featureFlags.assignSignalToEmployee = true;
      });

      it('should be based on departments related to category', () => {
        const { container, getByTestId, queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        );
        const editButton = getByTestId('editAssigned_user_idButton');

        fireEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(4);
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).toBeInTheDocument();
        expect(queryByText(userAscName)).toBeInTheDocument();
        expect(queryByText(userAegName)).toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should work with only one department related to category', () => {
        const { container, getByTestId, queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: departmentAscCode,
            },
          })
        );
        const editButton = getByTestId('editAssigned_user_idButton');

        fireEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(3);
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).toBeInTheDocument();
        expect(queryByText(userAscName)).toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should work with users related to more than one department', () => {
        const { container, getByTestId, queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: departmentAscCode,
            },
          })
        );
        const editButton = getByTestId('editAssigned_user_idButton');

        fireEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(3);
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).toBeInTheDocument();
        expect(queryByText(userAscName)).toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should work without any departments related to category', () => {
        const { container, getByTestId, queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: undefined,
            },
          })
        );
        const editButton = getByTestId('editAssigned_user_idButton');

        fireEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(1);
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).not.toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should work without any departments defined', () => {
        jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => ({ count: 0, list: [] }));
        const { container, getByTestId, queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        );
        const editButton = getByTestId('editAssigned_user_idButton');

        fireEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(1);
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).not.toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should work without a departments result set', () => {
        jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => null);
        const { container, getByTestId, queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        );
        const editButton = getByTestId('editAssigned_user_idButton');

        fireEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(1);
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).not.toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should use departments related to by routing, if present, instead', () => {
        const { container, getByTestId, queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                code: departmentThoCode,
                name: departmentThoName,
              },
            ],
          })
        );
        const editButton = getByTestId('editAssigned_user_idButton');

        fireEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(2);
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).not.toBeInTheDocument();
        expect(queryByText(userAscName)).not.toBeInTheDocument();
        expect(queryByText(userAegName)).not.toBeInTheDocument();
        expect(queryByText(userThoName)).toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should fallback to departments related to category when no routing departments present', () => {
        const { container, getByTestId, queryByText } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [],
          })
        );
        const editButton = getByTestId('editAssigned_user_idButton');

        fireEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(4);
        expect(queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(queryByText(userAscAegName)).toBeInTheDocument();
        expect(queryByText(userAscName)).toBeInTheDocument();
        expect(queryByText(userAegName)).toBeInTheDocument();
        expect(queryByText(userThoName)).not.toBeInTheDocument();
        expect(queryByText(userUndefinedName)).not.toBeInTheDocument();
      });
    });
  });

  describe('assign department', () => {
    const departmentLabel = 'Afdeling';
    const notFound = 'Niet gevonden';
    const notLinked = 'Niet gekoppeld';

    it('should not show assigned department by default', () => {
      render(renderWithContext());

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument();
    });

    it('should not show assigned department without departments defined', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => ({ count: 0, list: [] }));
      render(renderWithContext());

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument();
    });

    it('should not show assigned department without departments result set', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => null);
      render(renderWithContext());

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument();
    });

    it('should not show assigned department if given category departments are not defined', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: 'UNDE, FINED',
          },
        })
      );

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument();
    });

    it('should not show assigned department without any category department', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: '',
          },
        })
      );

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument();
    });

    it('should not show assigned department without any category', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      render(
        renderWithContext({
          ...incidentFixture,
          category: null,
        })
      );

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument();
    });

    it('should not show assigned department with only one category department', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: departmentAscCode,
          },
        })
      );

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument();
    });

    it('should show assigned department with more than one category department and assignSignalToDepartment enabled', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: `${departmentAscCode}, ${departmentAegCode}`,
          },
        })
      );

      expect(screen.getByText(departmentLabel)).toBeInTheDocument();
    });

    describe('department name', () => {
      beforeEach(() => {
        configuration.featureFlags.assignSignalToDepartment = true;
      });

      it('should be visible', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                id: departmentAscId,
                code: departmentAscCode,
                name: departmentAscName,
              },
            ],
          })
        );

        expect(screen.queryByText(notFound)).not.toBeInTheDocument();
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument();
        expect(screen.getByText(departmentAscName)).toBeInTheDocument();
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument();
      });

      it('should indicate when not in category', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                id: departmentThoId,
                code: departmentThoCode,
                name: departmentThoName,
              },
            ],
          })
        );

        expect(screen.getByText(departmentLabel)).toBeInTheDocument();
        expect(screen.getByText(notFound)).toBeInTheDocument();
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument();
        expect(screen.queryByText(departmentAscName)).not.toBeInTheDocument();
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument();
      });

      it('should indicate when not linked yet', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [],
          })
        );

        expect(screen.queryByText(notFound)).not.toBeInTheDocument();
        expect(screen.getByText(notLinked)).toBeInTheDocument();
        expect(screen.queryByText(departmentAscName)).not.toBeInTheDocument();
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument();
      });

      it('should indicate not linked without signal departments', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: null,
          })
        );

        expect(screen.queryByText(notFound)).not.toBeInTheDocument();
        expect(screen.getByText(notLinked)).toBeInTheDocument();
        expect(screen.queryByText(departmentAscName)).not.toBeInTheDocument();
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument();
      });
    });

    describe('available departments', () => {
      beforeEach(() => {
        configuration.featureFlags.assignSignalToDepartment = true;
      });

      it('should be based on departments related to category', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                id: departmentAscId,
                code: departmentAscCode,
                name: departmentAscName,
              },
            ],
          })
        );

        fireEvent.click(screen.getByTestId('editRouting_departmentsButton'));

        expect(document.querySelectorAll('select[data-testid="input"] option').length).toBe(2);
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument();
        expect(screen.getAllByText(departmentAscName).length).toBe(2);
        expect(screen.getByText(departmentAegName)).toBeInTheDocument();
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument();
      });

      it('should have the extra option not linked if that is the case', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [],
          })
        );

        fireEvent.click(screen.getByTestId('editRouting_departmentsButton'));

        expect(document.querySelectorAll('select[data-testid="input"] option').length).toBe(3);
        expect(screen.getAllByText(notLinked).length).toBe(2);
        expect(screen.getByText(departmentAscName)).toBeInTheDocument();
        expect(screen.getByText(departmentAegName)).toBeInTheDocument();
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument();
      });

      it('should not be affected if a different department selected', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                id: departmentThoId,
                code: departmentThoCode,
                name: departmentThoName,
              },
            ],
          })
        );

        fireEvent.click(screen.getByTestId('editRouting_departmentsButton'));

        expect(document.querySelectorAll('select[data-testid="input"] option').length).toBe(2);
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument();
        expect(screen.getAllByText(departmentAscName).length).toBe(2);
        expect(screen.getByText(departmentAegName)).toBeInTheDocument();
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument();
      });
    });

    it('should update connected department', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: `${departmentAscCode}, ${departmentAegCode}`,
          },
          routing_departments: [
            {
              id: departmentAscId,
              code: departmentAscCode,
              name: departmentAscName,
            },
          ],
        })
      );

      fireEvent.click(screen.getByTestId('editRouting_departmentsButton'));
      fireEvent.click(screen.getByTestId('submitRouting_departmentsButton'));

      expect(update).toHaveBeenCalledWith({
        patch: {
          routing_departments: [
            {
              id: departmentAscId,
            },
          ],
        },
        type: 'routing_departments',
      });
    });

    it('should update not connected department', () => {
      configuration.featureFlags.assignSignalToDepartment = true;
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: `${departmentAscCode}, ${departmentAegCode}`,
          },
          routing_departments: [],
        })
      );

      fireEvent.click(screen.getByTestId('editRouting_departmentsButton'));
      fireEvent.click(screen.getByTestId('submitRouting_departmentsButton'));

      expect(update).toHaveBeenCalledWith({
        patch: {
          routing_departments: [],
        },
        type: 'routing_departments',
      });
    });
  });

  describe('update directing departmens', () => {
    it('should update for directing department to ASC', async () => {
      jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => ({ ...departments }));
      jest.spyOn(departmentsSelectors, 'makeSelectDirectingDepartments').mockImplementation(() => directingDepartments);
      const { getAllByTestId, getByTestId } = render(renderWithContext(parentIncident));

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton';
      const submitTestId = 'submitDirecting_departmentsButton';
      const editButtons = getAllByTestId(editTestId);

      const { id } = departments.list.find(department => department.code === 'ASC');

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
      jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => ({ ...departments }));
      jest.spyOn(departmentsSelectors, 'makeSelectDirectingDepartments').mockImplementation(() => directingDepartments);
      const { getAllByTestId, getByTestId } = render(
        renderWithContext({
          ...parentIncident,
          directing_departments: [{ id: departments.list[0].id, code: departments.list[0].code }],
        })
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

    it('should update for directing department to empty if code unknown', async () => {
      jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => null);
      const { getAllByTestId } = render(
        renderWithContext({
          ...parentIncident,
          directing_departments: [{ id: departments.list[0].id, code: 'unknown' }],
        })
      );

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton';
      const submitTestId = 'submitDirecting_departmentsButton';
      const editButtons = getAllByTestId(editTestId);

      fireEvent.click(editButtons[0]);

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

    it('should update for directing department to empty if no departments defined', async () => {
      jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => null);
      const { getAllByTestId, getByTestId } = render(renderWithContext(parentIncident));

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton';
      const submitTestId = 'submitDirecting_departmentsButton';
      const editButtons = getAllByTestId(editTestId);

      fireEvent.click(editButtons[0]);

      fireEvent.click(getByTestId('input-ASC'));

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
