import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import categoriesFixture from 'utils/__tests__/fixtures/categories_private.json';
import * as catgorySelectors from 'models/categories/selectors';

import { getCategory } from 'shared/services/resolveClassification';
import CategorySelect from './CategorySelect';

const subcategories = categoriesFixture.results
  .filter(catgorySelectors.filterForSub)
  .filter(category => category.is_active)
  .slice(0, 2);

describe('signals/incident/components/form/CategorySelect', () => {
  let props;
  const metaFields = {
    name: 'categorySelect',
    placeholder: 'type here',
  };

  beforeEach(() => {
    props = {
      handler: jest.fn(() => ({
        value: {
          sub_category: 'baz',
          name: 'Baz',
          slug: 'baz',
        },
      })),
      parent: {
        meta: {
          updateIncident: jest.fn(),
          getClassification: jest.fn(),
          incidentContainer: { usePredictions: true },
        },
        value: jest.fn(),
        controls: {
          'input-field-name1': {
            updateValueAndValidity: jest.fn(),
          },
        },
      },
    };

    jest.spyOn(catgorySelectors, 'makeSelectSubCategories').mockImplementation(() => subcategories);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render select field correctly', () => {
    const { getByTestId } = render(
      withAppContext(
        <CategorySelect
          {...props}
          meta={{
            ...metaFields,
          }}
        />
      )
    );

    const element = getByTestId('categorySelect');
    expect(element).toBeInTheDocument();
    expect(element.querySelectorAll('option').length).toEqual(subcategories.length);
  });

  it('should render empty select field when no categoeies are found', () => {
    jest.spyOn(catgorySelectors, 'makeSelectSubCategories').mockImplementation(() => []);
    const { getByTestId } = render(withAppContext(<CategorySelect {...props} meta={{ ...metaFields }} />));
    const element = getByTestId('categorySelect');
    expect(element).toBeInTheDocument();
    expect(element.querySelectorAll('option').length).toEqual(0);
  });

  it('sets incident when value changes', async () => {
    const { getByTestId, findByTestId } = render(
      withAppContext(
        <CategorySelect
          {...props}
          meta={{
            ...metaFields,
          }}
        />
      )
    );

    const element = getByTestId('categorySelect');
    element.focus();
    act(() => {
      const event = { target: { value: subcategories[1].slug } };
      fireEvent.change(element, event);
    });

    await findByTestId('categorySelect');

    const { handling_message, ...category } = getCategory(subcategories[1]);
    expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({ category, handling_message });
  });
});
