import React from 'react';
import { fireEvent, render, cleanup, act } from '@testing-library/react';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { store, withAppContext } from 'test/utils';
import incidentJson from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';

import MetaList from './index';

jest.mock('shared/services/string-parser/string-parser');

store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

describe('<MetaList />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: incidentJson,
      onPatchIncident: jest.fn(),
      onEditStatus: jest.fn(),
      onShowAttachment: jest.fn(),
    };

    string2date.mockImplementation(() => '21-07-1970');
    string2time.mockImplementation(() => '11:56');
  });

  afterEach(cleanup);

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId, queryByText } = render(withAppContext(<MetaList {...props} />));

      expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(queryByText('Urgentie')).toBeInTheDocument();
      expect(queryByText('Normaal')).toBeInTheDocument();

      expect(queryByText('Subcategorie')).toBeInTheDocument();
      expect(queryByText(incidentJson.category.sub)).toBeInTheDocument();
      expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentJson.category.main);

      expect(queryByTestId('meta-list-department-definition')).toHaveTextContent(/^Verantwoordelijke afdeling$/);
      expect(queryByTestId('meta-list-department-value')).toHaveTextContent(incidentJson.category.departments);

      expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('meta-list-source-value')).toHaveTextContent(incidentJson.source);
    });

    it('should render correctly with high priority', () => {
      const { queryByText, container, rerender } = render(withAppContext(<MetaList {...props} />));

      expect(queryByText('Hoog')).not.toBeInTheDocument();
      expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(1);

      props.incident.priority.priority = 'high';
      rerender(withAppContext(<MetaList {...props} />));

      expect(queryByText('Hoog')).toBeInTheDocument();
      expect(container.firstChild.querySelectorAll('.alert')).toHaveLength(2);
    });

    it('should render correctly with parent', () => {
      props.incident._links['sia:parent'] = {
        href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3094',
      };

      const { queryByTestId } = render(withAppContext(<MetaList {...props} />));

      expect(queryByTestId('meta-list-parent-definition')).toHaveTextContent(/^Oorspronkelijke melding$/);
      expect(queryByTestId('meta-list-parent-link')).toHaveTextContent(/^3094$/);

      expect(queryByTestId('meta-list-parent-link')).toHaveAttribute('href', '/manage/incident/3094');
    });

    it('should render correctly with children', () => {
      props.incident._links['sia:children'] = [
        { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3095' },
        { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3096' },
      ];

      const { queryByTestId } = render(withAppContext(<MetaList {...props} />));

      expect(queryByTestId('meta-list-children-definition')).toHaveTextContent(/^Gesplitst in$/);
      expect(queryByTestId('meta-list-children-link-3095')).toHaveTextContent(/^3095$/);
      expect(queryByTestId('meta-list-children-link-3096')).toHaveTextContent(/^3096$/);

      expect(queryByTestId('meta-list-children-link-3095')).toHaveAttribute('href', '/manage/incident/3095');
      expect(queryByTestId('meta-list-children-link-3096')).toHaveAttribute('href', '/manage/incident/3096');
    });

    it('should call onPatchIncident', async () => {
      const { getAllByTestId } = render(withAppContext(<MetaList {...props} />));
      const editButtons = getAllByTestId('editButton');

      act(() => {
        fireEvent.click(editButtons[0]);
      });

      const submitButtons = getAllByTestId('submitButton');

      expect(props.onPatchIncident).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(submitButtons[0]);
      });

      expect(props.onPatchIncident).toHaveBeenCalled();
    });
  });
});
