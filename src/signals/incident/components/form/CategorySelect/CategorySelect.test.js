import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import { subCategories } from 'utils/__tests__/fixtures';
import * as catgorySelectors from 'models/categories/selectors';

import { getCategoryData } from 'shared/services/resolveClassification';
import CategorySelect from './CategorySelect';

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

    jest.spyOn(catgorySelectors, 'makeSelectSubCategories').mockImplementation(() => subCategories);
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
    expect(element.querySelectorAll('option').length).toEqual(subCategories.length);
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
      const event = { target: { value: subCategories[1].slug } };
      fireEvent.change(element, event);
    });

    await findByTestId('categorySelect');

    const { handling_message, ...category } = getCategoryData(subCategories[1]);
    expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({ category, handling_message });
  });
});
