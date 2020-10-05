import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import { subCategories } from 'utils/__tests__/fixtures';
import * as categorySelectors from 'models/categories/selectors';

import CategorySelect from './CategorySelect';

describe('signals/incident/components/form/CategorySelect', () => {
  let props;
  const metaFields = {
    name: 'categorySelect',
  };

  beforeEach(() => {
    props = {
      handler: jest.fn(() => ({
        value: 'asbest-accu',
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
    jest.spyOn(categorySelectors, 'makeSelectSubCategories').mockImplementation(() => subCategories);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render select field correctly', () => {
    const { queryByTestId } = render(
      withAppContext(
        <CategorySelect
          {...props}
          meta={{
            ...metaFields,
          }}
        />
      )
    );

    const element = queryByTestId('categorySelect');
    expect(element).toBeInTheDocument();
    expect(element.querySelectorAll('option').length).toEqual(subCategories.length);
    expect(queryByTestId('infoText')).toBeInTheDocument();
  });

  it('should render empty select field when no categoeies are found', () => {
    jest.spyOn(categorySelectors, 'makeSelectSubCategories').mockImplementation(() => null);
    const { queryByTestId } = render(withAppContext(<CategorySelect {...props} meta={{ ...metaFields }} />));
    const element = queryByTestId('categorySelect');
    expect(element).toBeInTheDocument();
    expect(element.querySelectorAll('option').length).toEqual(0);
    expect(queryByTestId('infoText')).not.toBeInTheDocument();
  });

  it('sets incident when value changes', async () => {
    const testSubcategory = { ...subCategories[1] };
    const { id, slug, category_slug: category, name, handling_message } = testSubcategory;

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
      const event = { target: { value: slug } };
      fireEvent.change(element, event);
    });

    await findByTestId('categorySelect');
    const testCategory = {
      category,
      subcategory: slug,
      classification: {
        id,
        name,
        slug,
      },
      handling_message,
    };
    expect(props.parent.meta.updateIncident).toHaveBeenCalledWith(testCategory);

    await findByTestId('categorySelect');
    expect(getByTestId('infoText')).toBeInTheDocument();
  });
});
