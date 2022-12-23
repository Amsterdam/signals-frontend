// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, act, fireEvent } from '@testing-library/react'

import * as categoriesSelectors from 'models/categories/selectors'
import { withAppContext } from 'test/utils'
import { subcategoriesGroupedByCategories } from 'utils/__tests__/fixtures'

import CategorySelect from './CategorySelect'

describe('signals/incident/components/form/CategorySelect', () => {
  let props
  const subcategoryOptions = [...subcategoriesGroupedByCategories[1]]
  const metaFields = {
    name: 'category-select',
  }

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
    }
    jest
      .spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories')
      .mockImplementation(() => subcategoriesGroupedByCategories)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

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
    )

    const element = queryByTestId('category-select')
    expect(element).toBeInTheDocument()
    expect(element.querySelectorAll('option').length).toEqual(
      subcategoryOptions.length + 1
    )
    expect(queryByTestId('info-text')).toBeInTheDocument()
  })

  it('should render empty select field when no categories are found', () => {
    jest
      .spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories')
      .mockImplementation(() => [[], []])
    const { queryByTestId } = render(
      withAppContext(<CategorySelect {...props} meta={{ ...metaFields }} />)
    )
    const element = queryByTestId('category-select')
    expect(element).toBeInTheDocument()
    expect(element.querySelectorAll('option').length).toEqual(1)
    expect(queryByTestId('info-text')).not.toBeInTheDocument()
  })

  it('sets incident when value changes', async () => {
    const testSubcategory = { ...subcategoryOptions[1] }
    const {
      id,
      slug,
      category_slug: category,
      name,
      handling_message,
    } = testSubcategory

    const { getByTestId, findByTestId } = render(
      withAppContext(
        <CategorySelect
          {...props}
          meta={{
            ...metaFields,
          }}
        />
      )
    )

    const element = getByTestId('category-select')
    element.focus()
    act(() => {
      const event = { target: { value: slug } }
      fireEvent.change(element, event)
    })

    await findByTestId('category-select')
    const testCategory = {
      category,
      subcategory: slug,
      classification: {
        id,
        name,
        slug,
      },
      handling_message,
    }
    expect(props.parent.meta.updateIncident).toHaveBeenCalledWith(testCategory)

    await findByTestId('category-select')
    expect(getByTestId('info-text')).toBeInTheDocument()
  })
})
