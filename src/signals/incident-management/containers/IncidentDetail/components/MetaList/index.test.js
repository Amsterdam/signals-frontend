import React from 'react';
import {
  fireEvent,
  render,
  cleanup,
  act,
} from '@testing-library/react';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { withAppContext } from 'test/utils';
import categories from 'utils/__tests__/fixtures/categories_structured.json';

import { priorityList, typesList } from 'signals/incident-management/definitions';

import MetaList from './index';

jest.mock('shared/services/string-parser/string-parser');

const subcategories = Object.entries(categories).flatMap(
  ([, { sub }]) => sub
);

describe('<MetaList />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: {
        created_at: '',
        category: {
          category_url: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/overlast-bedrijven-en-horeca/sub_categories/overig-horecabedrijven',
          sub: 'Overig bedrijven / horeca',
          sub_slug: 'overig-horecabedrijven',
          main: 'Overlast Bedrijven en Horeca',
          main_slug: 'overlast-bedrijven-en-horeca',
          departments: 'VTH',
          created_by: null,
          text: null,
        },
        source: 'public-api',
        status: {
          state: 'm',
          state_display: 'Gemeld',
        },
        priority: {
          priority: 'normal',
        },
        type: {
          code: 'SIG',
        },
        _links: {},
      },
      subcategories,
      priorityList,
      typesList,
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
      const { queryByTestId, queryByText } = render(
        <MetaList {...props} />
      );

      expect(queryByTestId('meta-list-date-definition')).toHaveTextContent(/^Gemeld op$/);
      expect(queryByTestId('meta-list-date-value')).toHaveTextContent(/^21-07-1970 11:56$/);

      expect(queryByTestId('meta-list-status-definition')).toHaveTextContent(/^Status$/);
      expect(queryByTestId('meta-list-status-value')).toHaveTextContent(/^Gemeld$/);

      expect(queryByText('Urgentie')).toBeTruthy();
      expect(queryByText('Normaal')).toBeTruthy();

      expect(queryByText('Subcategorie')).toBeTruthy();
      expect(queryByText('Overig bedrijven / horeca')).toBeTruthy();
      expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(/^Overlast Bedrijven en Horeca$/);

      expect(queryByTestId('meta-list-department-definition')).toHaveTextContent(/^Verantwoordelijke afdeling$/);
      expect(queryByTestId('meta-list-department-value')).toHaveTextContent(/^VTH$/);

      expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('meta-list-source-value')).toHaveTextContent(/^public-api$/);
    });

    it('should render the correct HTML elements for priority', () => {
      const { getByText } = render(
        <MetaList {...props} />
      );

      const showFormButton = getByText('Urgentie')
        .closest('div')
        .querySelector('.change-value__edit.incident-detail__button--edit');

      expect(
        getByText('Urgentie')
          .closest('div')
          .querySelectorAll('input[type="radio"]').length
      ).toBe(0);

      act(() => {
        fireEvent.click(showFormButton);
      });

      expect(
        getByText('Urgentie')
          .closest('div')
          .querySelectorAll('input[type="radio"]').length
      ).toBeGreaterThan(0);
    });

    it('should render the correct HTML elements for type', () => {
      const { getByText } = render(
        <MetaList {...props} />
      );

      const showFormButton = getByText('Type')
        .closest('div')
        .querySelector('.change-value__edit.incident-detail__button--edit');

      expect(
        getByText('Type')
          .closest('div')
          .querySelectorAll('input[type="radio"]').length
      ).toBe(0);

      act(() => {
        fireEvent.click(showFormButton);
      });

      expect(
        getByText('Type')
          .closest('div')
          .querySelectorAll('input[type="radio"]').length
      ).toBeGreaterThan(0);
    });

    it('should render the correct HTML elements for subcategories', () => {
      const { getByText } = render(<MetaList {...props} />);

      const showFormButton = getByText('Subcategorie')
        .closest('div')
        .querySelector('.change-value__edit.incident-detail__button--edit');

      expect(
        getByText('Subcategorie')
          .closest('div')
          .querySelectorAll('form select').length
      ).toBe(0);

      act(() => {
        fireEvent.click(showFormButton);
      });

      expect(
        getByText('Subcategorie')
          .closest('div')
          .querySelectorAll('form select').length
      ).toBeGreaterThan(0);
    });

    it('should render correctly with high priority', () => {
      props.incident.priority.priority = 'high';
      const { queryByText, container } = render(
        withAppContext(<MetaList {...props} />)
      );

      expect(queryByText('Urgentie')).toBeTruthy();
      expect(queryByText('Hoog')).toBeTruthy();

      expect(container.firstChild.querySelector('.meta-list__value--status')).toBeTruthy();
    });

    it('should render correctly with parent', () => {
      props.incident._links['sia:parent'] = { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3094' };

      const { queryByTestId } = render(
        withAppContext(<MetaList {...props} />)
      );

      expect(queryByTestId('meta-list-parent-definition')).toHaveTextContent(/^Oorspronkelijke melding$/);
      expect(queryByTestId('meta-list-parent-link')).toHaveTextContent(/^3094$/);

      expect(queryByTestId('meta-list-parent-link')).toHaveAttribute('href', '/manage/incident/3094');
    });

    it('should render correctly with children', () => {
      props.incident._links['sia:children'] = [
        { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3095' },
        { href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals/3096' },
      ];

      const { queryByTestId } = render(
        withAppContext(<MetaList {...props} />)
      );

      expect(queryByTestId('meta-list-children-definition')).toHaveTextContent(/^Gesplitst in$/);
      expect(queryByTestId('meta-list-children-link-3095')).toHaveTextContent(/^3095$/);
      expect(queryByTestId('meta-list-children-link-3096')).toHaveTextContent(/^3096$/);

      expect(queryByTestId('meta-list-children-link-3095')).toHaveAttribute('href', '/manage/incident/3095');
      expect(queryByTestId('meta-list-children-link-3096')).toHaveAttribute('href', '/manage/incident/3096');
    });
  });
});
