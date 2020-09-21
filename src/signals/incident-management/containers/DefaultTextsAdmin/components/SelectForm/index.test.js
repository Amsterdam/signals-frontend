import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { store, withAppContext } from 'test/utils';
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json';
import { fetchCategoriesSuccess } from 'models/categories/actions';
import { makeSelectSubCategories } from 'models/categories/selectors';

import SelectForm from '.';

import { defaultTextsOptionList } from '../../../../definitions/statusList';

store.dispatch(fetchCategoriesSuccess(categoriesPrivate));

const subCategories = makeSelectSubCategories(store.getState());

describe('<SelectForm />', () => {
  const category_url = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu';
  let props;

  beforeEach(() => {
    props = {
      subCategories,
      defaultTextsOptionList,
      onFetchDefaultTexts: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render form correctly', () => {
    const { queryByTestId, queryByText, getByDisplayValue, queryByDisplayValue } = render(
      withAppContext(<SelectForm {...props} />)
    );

    expect(queryByTestId('selectFormForm')).not.toBeNull();

    expect(queryByText('Subcategorie')).not.toBeNull();
    expect(getByDisplayValue('Asbest / accu')).not.toBeNull();

    expect(queryByText('Status')).not.toBeNull();
    expect(queryByText('Afgehandeld')).not.toBeNull();
    expect(queryByDisplayValue('o')).not.toBeNull();
    expect(queryByText('Ingepland')).not.toBeNull();
    expect(queryByText('Heropend')).not.toBeNull();

    expect(queryByDisplayValue('afval')).not.toBeNull();
    expect(queryByDisplayValue('asbest-accu')).not.toBeNull();
  });

  describe('events', () => {
    it('should trigger fetch default texts on load', () => {
      render(
        withAppContext(<SelectForm {...props} />)
      );

      expect(props.onFetchDefaultTexts).toHaveBeenCalledWith({
        category_url,
        state: 'o',
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      });
    });

    it('should trigger fetch default texts when a new status has been selected', () => {
      const { getByDisplayValue } = render(
        withAppContext(<SelectForm {...props} />)
      );
      const newStatus = 'ingepland';
      fireEvent.click(getByDisplayValue(newStatus));

      expect(props.onFetchDefaultTexts).toHaveBeenCalledWith({
        category_url,
        state: newStatus,
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      });
    });

    it('should NOT trigger fetch when no matching category can be found', () => {
      const invalidSubCategories = subCategories.map(subCat => ({
        ...subCat,
        _links: undefined,
      }));

      const { getByDisplayValue } = render(
        withAppContext(<SelectForm {...props} subCategories={invalidSubCategories} />)
      );

      expect(props.onFetchDefaultTexts).toHaveBeenCalledTimes(1);

      const newStatus = 'ingepland';
      fireEvent.click(getByDisplayValue(newStatus));

      expect(props.onFetchDefaultTexts).toHaveBeenCalledTimes(1);
    });

    it('should trigger fetch default texts when a new category has been selected', () => {
      const { getByTestId } = render(
        withAppContext(<SelectForm {...props} />)
      );

      const newCategory = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom';
      const event = {
        target: {
          value: newCategory,
        },
      };
      fireEvent.change(getByTestId('category_url'), event);

      expect(props.onFetchDefaultTexts).toHaveBeenCalledWith({
        category_url: newCategory,
        state: 'ingepland',
        sub_slug: 'boom',
        main_slug: 'openbaar-groen-en-water',
      });
    });
  });
});
