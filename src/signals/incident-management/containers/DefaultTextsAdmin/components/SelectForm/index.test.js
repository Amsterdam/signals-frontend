import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import categories from 'utils/__tests__/fixtures/categories.json';

import SelectForm from './index';

import { defaultTextsOptionList } from '../../../../definitions/statusList';

describe('<SelectForm />', () => {
  let props;

  beforeEach(() => {
    props = {
      subCategories: categories.sub,
      defaultTextsOptionList,

      onFetchDefaultTexts: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render form correctly', () => {
    const { queryByTestId, queryByText, queryByDisplayValue } = render(
      withAppContext(<SelectForm {...props} />)
    );

    expect(queryByTestId('selectFormForm')).not.toBeNull();

    expect(queryByText('Subcategorie')).not.toBeNull();
    expect(queryByText('Asbest / accu')).not.toBeNull();

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
        category_url: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
        state: 'o',
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      });
    });

    it('should trigger fetch default texts when a new status has been selected', () => {
      const { getByDisplayValue} = render(
        withAppContext(<SelectForm {...props} />)
      );
      const newStatus = 'ingepland';
      fireEvent.click(getByDisplayValue(newStatus));

      expect(props.onFetchDefaultTexts).toHaveBeenCalledWith({
        category_url: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
        state: newStatus,
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      });
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
        state: 'o',
        sub_slug: 'boom',
        main_slug: 'openbaar-groen-en-water',
      });
    });
  });
});
