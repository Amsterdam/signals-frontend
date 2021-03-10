import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import configuration from 'shared/services/configuration/configuration';
import { string2date, string2time } from 'shared/services/string-parser';
import { store, withAppContext } from 'test/utils';
import {
  departments,
  directingDepartments,
  handlingTimesBySlug,
  subcategoriesGroupedByCategories,
} from 'utils/__tests__/fixtures';
import { INCIDENT_URL } from 'signals/incident-management/routes';

import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import usersFixture from 'utils/__tests__/fixtures/users.json';

import { fetchCategoriesSuccess } from 'models/categories/actions';
import * as departmentsSelectors from 'models/departments/selectors';
import * as categoriesSelectors from 'models/categories/selectors';

import IncidentDetailContext from '../../context';
import IncidentManagementContext from '../../../../context';
import { rest, server, mockGet, fetchMock } from '../../../../../../../internals/testing/msw-server';
import MetaList from '.';

fetchMock.disableMocks();
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
const userEmptyName = usersFixture.results[0].username;
const userAscAegName = usersFixture.results[1].username;
const userAscName = usersFixture.results[2].username;
const userAegName = usersFixture.results[3].username;
const userThoName = usersFixture.results[4].username;
const userUndefinedName = usersFixture.results[5].username;

const plainLinks = Object.keys(incidentFixture._links)
  .filter(link => !['sia:children', 'sia:parent'].includes(link))
  .reduce((acc, key) => ({ ...acc, [key]: { ...incidentFixture._links[key] } }), {});

const plainIncident = { ...incidentFixture, _links: { ...plainLinks } };
const parentIncident = { ...incidentFixture };
const childIncident = { ...plainIncident, _links: { ...plainLinks, 'sia:parent': { href: 'http://parent-link' } } };

const renderWithContext = (incident = parentIncident) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident, update, edit }}>
      <MetaList />
    </IncidentDetailContext.Provider>
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
    jest.spyOn(categoriesSelectors, 'makeSelectHandlingTimesBySlug').mockImplementation(() => handlingTimesBySlug);
  });

  afterEach(() => {
    configuration.__reset();
  });

  describe('rendering', () => {
    it('should render correctly a plain incident', () => {
      render(renderWithContext(plainIncident));

      expect(screen.queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(screen.queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(screen.queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
      expect(screen.queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^4 werkdagen$/);

      expect(screen.queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(screen.queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(screen.queryByText('Urgentie')).toBeInTheDocument();
      expect(screen.queryByText('Normaal')).toBeInTheDocument();

      expect(screen.queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(screen.queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

      expect(screen.queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(screen.queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);

      expect(screen.queryByTestId('meta-list-parent-definition')).not.toBeInTheDocument();
      expect(screen.queryByTestId('meta-list-parent-value')).not.toBeInTheDocument();

      expect(screen.queryByTestId('meta-list-directing_departments-definition')).not.toBeInTheDocument();
    });

    it('should render correctly a parent incident', () => {
      render(renderWithContext(parentIncident));

      expect(screen.queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(screen.queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(screen.queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
      expect(screen.queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^4 werkdagen$/);

      expect(screen.queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(screen.queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(screen.queryByText('Urgentie')).toBeInTheDocument();
      expect(screen.queryByText('Normaal')).toBeInTheDocument();

      expect(screen.queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(screen.queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

      expect(screen.queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(screen.queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);

      expect(screen.queryByTestId('meta-list-parent-definition')).not.toBeInTheDocument();
      expect(screen.queryByTestId('meta-list-parent-value')).not.toBeInTheDocument();

      expect(screen.queryByTestId('meta-list-directing_departments-definition')).toBeInTheDocument();
    });

    it('should render correctly a child incident', () => {
      render(renderWithContext(childIncident));

      expect(screen.queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(screen.queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(screen.queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(screen.queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(screen.queryByText('Urgentie')).toBeInTheDocument();
      expect(screen.queryByText('Normaal')).toBeInTheDocument();

      expect(screen.queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(screen.queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

      expect(screen.queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(screen.queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);

      expect(screen.queryByTestId('meta-list-parent-definition')).toHaveTextContent(/^Hoofdmelding$/);
      expect(screen.queryByTestId('meta-list-parent-value')).toHaveTextContent(/^parent-link$/);
      // expect(screen.queryByTestId('meta-list-parent-link')).toHaveAttribute('href', /^\/manage\/incident\/parent-link$/);
      expect(screen.queryByTestId('meta-list-parent-link')).toHaveAttribute('href', `${INCIDENT_URL}/parent-link`);

      expect(screen.queryByTestId('meta-list-directing_departments-definition')).not.toBeInTheDocument();
    });
  });

  it('should render correctly with high priority', () => {
    const { container, rerender } = render(renderWithContext());

    expect(screen.queryByText('Hoog')).not.toBeInTheDocument();
    expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(1);

    rerender(renderWithContext({ ...incidentFixture, priority: { ...incidentFixture.priority, priority: 'high' } }));

    expect(screen.queryByText('Hoog')).toBeInTheDocument();
    expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(2);
  });

  it('should render days and workdays in single and plural form', () => {
    const { rerender } = render(renderWithContext(plainIncident));

    expect(screen.queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
    expect(screen.queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^4 werkdagen$/);

    rerender(renderWithContext({ ...plainIncident, category: { sub_slug: 'beplanting' } }));
    expect(screen.queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
    expect(screen.queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^1 werkdag$/);

    rerender(renderWithContext({ ...plainIncident, category: { sub_slug: 'bewegwijzering' } }));
    expect(screen.queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
    expect(screen.queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^1 dag$/);

    rerender(renderWithContext({ ...plainIncident, category: { sub_slug: 'autom-verzinkbare-palen' } }));
    expect(screen.queryByTestId('meta-list-handling-time-definition')).toHaveTextContent(/^Afhandeltermijn$/);
    expect(screen.queryByTestId('meta-list-handling-time-value')).toHaveTextContent(/^21 dagen$/);
  });

  it('should call edit', () => {
    render(renderWithContext());

    expect(edit).not.toHaveBeenCalled();

    fireEvent.click(screen.queryByTestId('editStatusButton'));

    expect(edit).toHaveBeenCalled();
  });

  it('should call update', () => {
    render(
      renderWithContext({ ...incidentFixture, priority: { ...incidentFixture.priority, priority: 'high' } })
    );

    // priority button data-testid attribute is dynamically generated in the ChangeValue component:
    const editTestId = 'editPriorityButton';
    const submitTestId = 'submitPriorityButton';
    const editButtons = screen.getAllByTestId(editTestId);

    fireEvent.click(editButtons[0]);

    const submitButtons = screen.getAllByTestId(submitTestId);

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
    const selectedSubcategory = /Asbest \/ accu/;

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
    it('should not show assigned user by default', async () => {
      render(renderWithContext());
      await screen.findByTestId('meta-list-date-definition');

      expect(screen.queryByTestId('meta-list-assigned_user_email-definition')).not.toBeInTheDocument();
      expect(screen.queryByTestId('meta-list-assigned_user_email-value')).not.toBeInTheDocument();
    });

    it('should show assigned user with assignSignalToEmployee enabled', async () => {
      configuration.featureFlags.assignSignalToEmployee = true;
      render(renderWithContext());
      await screen.findByTestId('meta-list-date-definition');

      expect(screen.getByTestId('meta-list-assigned_user_email-definition')).toBeInTheDocument();
      expect(screen.getByTestId('meta-list-assigned_user_email-value')).toBeInTheDocument();
      expect(screen.getByText('Niet toegewezen')).toBeInTheDocument();
    });

    it('should not show assigned user when users not defined', async () => {
      configuration.featureFlags.assignSignalToEmployee = true;
      mockGet(404, { message: 'No users defined' });
      render(renderWithContext(incidentFixture));
      await screen.findByTestId('meta-list-date-definition');

      expect(screen.queryByTestId('meta-list-assigned_user_email-definition')).not.toBeInTheDocument();
      expect(screen.queryByTestId('meta-list-assigned_user_email-value')).not.toBeInTheDocument();
    });

    describe('username', () => {
      it('should be visible', async () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: userAscAegName,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(screen.queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(screen.getByText(userAscAegName)).toBeInTheDocument();
        expect(screen.queryByText(userAscName)).not.toBeInTheDocument();
        expect(screen.queryByText(userAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(userThoName)).not.toBeInTheDocument();
        expect(screen.queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should be visible even if in another department', async () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: userAscAegName,
            category: {
              ...incidentFixture.category,
              departments: departmentThoCode,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(screen.queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(screen.getByText(userAscAegName)).toBeInTheDocument();
        expect(screen.queryByText(userAscName)).not.toBeInTheDocument();
        expect(screen.queryByText(userAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(userThoName)).not.toBeInTheDocument();
        expect(screen.queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should be visible even if not in a department', async () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: userEmptyName,
            category: {
              ...incidentFixture.category,
              departments: departmentThoCode,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(screen.getByText(userEmptyName)).toBeInTheDocument();
        expect(screen.queryByText(userAscAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(userAscName)).not.toBeInTheDocument();
        expect(screen.queryByText(userAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(userThoName)).not.toBeInTheDocument();
        expect(screen.queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should be visible even if the category has no departments defined', async () => {
        configuration.featureFlags.assignSignalToEmployee = true;

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: userAscAegName,
            category: {
              ...incidentFixture.category,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument();
        expect(screen.queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(screen.getByText(userAscAegName)).toBeInTheDocument();
        expect(screen.queryByText(userAscName)).not.toBeInTheDocument();
        expect(screen.queryByText(userAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(userThoName)).not.toBeInTheDocument();
        expect(screen.queryByText(userUndefinedName)).not.toBeInTheDocument();
      });
    });

    describe('available users', () => {
      beforeEach(() => {
        configuration.featureFlags.assignSignalToEmployee = true;
      });

      it('should be based on departments related to category', async () => {
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        const editButton = screen.getByTestId('editAssigned_user_emailButton');
        userEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(4);
        expect(screen.queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(screen.getByText(userAscAegName)).toBeInTheDocument();
        expect(screen.getByText(userAscName)).toBeInTheDocument();
        expect(screen.getByText(userAegName)).toBeInTheDocument();
        expect(screen.queryByText(userThoName)).not.toBeInTheDocument();
        expect(screen.queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should work with only one department related to category', async () => {
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: departmentAscCode,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        const editButton = screen.getByTestId('editAssigned_user_emailButton');
        userEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(3);
        expect(screen.queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(screen.getByText(userAscAegName)).toBeInTheDocument();
        expect(screen.getByText(userAscName)).toBeInTheDocument();
        expect(screen.queryByText(userAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(userThoName)).not.toBeInTheDocument();
        expect(screen.queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should not work without any departments related to category', async () => {
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: undefined,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        expect(screen.queryByTestId('meta-list-assigned_user_email-definition')).not.toBeInTheDocument();
        expect(screen.queryByTestId('meta-list-assigned_user_email-value')).not.toBeInTheDocument();
      });

      it('should not work without any departments defined', async () => {
        jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => ({ count: 0, list: [] }));
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        expect(screen.queryByTestId('meta-list-assigned_user_email-definition')).not.toBeInTheDocument();
        expect(screen.queryByTestId('meta-list-assigned_user_email-value')).not.toBeInTheDocument();
      });

      it('should not work without a departments result set', async () => {
        jest.spyOn(departmentsSelectors, 'makeSelectDepartments').mockImplementation(() => null);
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        expect(screen.queryByTestId('meta-list-assigned_user_email-definition')).not.toBeInTheDocument();
        expect(screen.queryByTestId('meta-list-assigned_user_email-value')).not.toBeInTheDocument();
      });

      it('should use departments related to by routing, if present, instead', async () => {
        const { container } = render(
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

        await screen.findByTestId('meta-list-date-definition');

        const editButton = screen.getByTestId('editAssigned_user_emailButton');
        userEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(2);
        expect(screen.queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(screen.queryByText(userAscAegName)).not.toBeInTheDocument();
        expect(screen.queryByText(userAscName)).not.toBeInTheDocument();
        expect(screen.queryByText(userAegName)).not.toBeInTheDocument();
        expect(screen.getByText(userThoName)).toBeInTheDocument();
        expect(screen.queryByText(userUndefinedName)).not.toBeInTheDocument();
      });

      it('should fallback to departments related to category when no routing departments present', async () => {
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [],
          })
        );

        await screen.findByTestId('meta-list-date-definition');

        const editButton = screen.getByTestId('editAssigned_user_emailButton');
        userEvent.click(editButton);

        expect(container.querySelectorAll('select[data-testid="input"] option').length).toBe(4);
        expect(screen.queryByText(userEmptyName)).not.toBeInTheDocument();
        expect(screen.getByText(userAscAegName)).toBeInTheDocument();
        expect(screen.getByText(userAscName)).toBeInTheDocument();
        expect(screen.getByText(userAegName)).toBeInTheDocument();
        expect(screen.queryByText(userThoName)).not.toBeInTheDocument();
        expect(screen.queryByText(userUndefinedName)).not.toBeInTheDocument();
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
      render(renderWithContext(parentIncident));

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton';
      const submitTestId = 'submitDirecting_departmentsButton';
      const editButtons = screen.getAllByTestId(editTestId);

      const { id } = departments.list.find(department => department.code === 'ASC');

      fireEvent.click(editButtons[0]);

      fireEvent.click(screen.getByTestId('input-ASC'));

      const submitButtons = screen.getAllByTestId(submitTestId);

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
      render(
        renderWithContext({
          ...parentIncident,
          directing_departments: [{ id: departments.list[0].id, code: departments.list[0].code }],
        })
      );

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton';
      const submitTestId = 'submitDirecting_departmentsButton';
      const editButtons = screen.getAllByTestId(editTestId);

      fireEvent.click(editButtons[0]);
      fireEvent.click(screen.getByTestId('input-null'));

      const submitButtons = screen.getAllByTestId(submitTestId);

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
      render(
        renderWithContext({
          ...parentIncident,
          directing_departments: [{ id: departments.list[0].id, code: 'unknown' }],
        })
      );

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton';
      const submitTestId = 'submitDirecting_departmentsButton';
      const editButtons = screen.getAllByTestId(editTestId);

      fireEvent.click(editButtons[0]);

      const submitButtons = screen.getAllByTestId(submitTestId);

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
      render(renderWithContext(parentIncident));

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton';
      const submitTestId = 'submitDirecting_departmentsButton';
      const editButtons = screen.getAllByTestId(editTestId);

      fireEvent.click(editButtons[0]);

      fireEvent.click(screen.getByTestId('input-ASC'));

      const submitButtons = screen.getAllByTestId(submitTestId);

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
