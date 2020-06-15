import React from 'react';
import { fireEvent, render, cleanup, act } from '@testing-library/react';
import * as reactRedux from 'react-redux';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { store, withAppContext } from 'test/utils';
import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';
import { patchIncident } from 'models/incident/actions';

import MetaList, { getCategoryName }from './index';

jest.mock('shared/services/string-parser/string-parser');

store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

describe('<MetaList />', () => {
  let props;

  beforeEach(() => {
    props = {
      incident: incidentFixture,
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
      const subcategory = categoriesPrivate.results.find(cat => cat.name === incidentFixture.category.sub);
      const categoryName = getCategoryName({ name: incidentFixture.category.sub, departments: subcategory.departments });
      expect(queryByText(categoryName)).toBeInTheDocument();
      expect(queryByTestId('meta-list-main-category-definition')).toHaveTextContent(/^Hoofdcategorie$/);
      expect(queryByTestId('meta-list-main-category-value')).toHaveTextContent(incidentFixture.category.main);

      expect(queryByTestId('meta-list-source-definition')).toHaveTextContent(/^Bron$/);
      expect(queryByTestId('meta-list-source-value')).toHaveTextContent(incidentFixture.source);
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

      expect(dispatch).not.toHaveBeenCalled();

      act(() => {
        fireEvent.click(submitButtons[0]);
      });

      expect(dispatch).toHaveBeenCalledWith(patchIncident({
        id: incidentFixture.id,
        patch: {
          priority: {
            priority: 'high',
          },
        },
        type: 'priority',
      }));
    });
  });

  describe('getCategoryName', () => {
    it('should create the correct category name', () => {
      const category = {
        name: 'Foo',
        departments:[
          { code: 'Bar', is_responsible: true },
          { code: 'Baz', is_responsible: false },
        ],
      };

      expect(getCategoryName(category)).toEqual('Foo (Bar)');
    });
  });
});
