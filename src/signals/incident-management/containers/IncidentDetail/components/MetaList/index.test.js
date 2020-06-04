import React from 'react';
import { fireEvent, render, cleanup, act } from '@testing-library/react';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { store, withAppContext } from 'test/utils';
import incidentJson from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';

import MetaList, { getCategoryName }from './index';

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
      const subcategory = categoriesPrivate.results.find(cat => cat.name === incidentJson.category.sub);
      const categoryName = getCategoryName({ name: incidentJson.category.sub, departments: subcategory.departments });
      expect(queryByText(categoryName)).toBeInTheDocument();
      expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentJson.category.main);

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

    it('should call onPatchIncident', async () => {
      const { getAllByTestId } = render(withAppContext(<MetaList {...props} />));

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editPriorityButton';
      const submitTestId = 'submitPriorityButton';
      const editButtons = getAllByTestId(editTestId);

      act(() => {
        fireEvent.click(editButtons[0]);
      });

      const submitButtons = getAllByTestId(submitTestId);

      expect(props.onPatchIncident).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(submitButtons[0]);
      });

      expect(props.onPatchIncident).toHaveBeenCalled();
    });
  });

  describe('getCategoryName', () => {
    it('should create the correct category name', () => {
      const category = {
        name: 'Foo',
        departments:[
          { code: 'Bar' },
          { code: 'Baz' },
        ],
      };

      expect(getCategoryName(category)).toEqual('Foo (Bar,Baz)');
    });
  });
});
