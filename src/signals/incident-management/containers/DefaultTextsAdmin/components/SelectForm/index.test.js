// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { render, fireEvent } from '@testing-library/react'

import * as categoriesSelectors from 'models/categories/selectors'
import { withAppContext } from 'test/utils'
import { subcategoriesGroupedByCategories } from 'utils/__tests__/fixtures'

import SelectForm from '.'
import { defaultTextsOptionList } from '../../../../definitions/statusList'

describe('SelectForm', () => {
  const subcategories = subcategoriesGroupedByCategories[1]
  const category_url =
    'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu'
  let props

  beforeEach(() => {
    props = {
      defaultTextsOptionList,
      onFetchDefaultTexts: jest.fn(),
    }
    jest
      .spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories')
      .mockImplementation(() => subcategoriesGroupedByCategories)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render form correctly', () => {
    const { queryByTestId, queryByText, queryByDisplayValue } = render(
      withAppContext(<SelectForm {...props} />)
    )

    expect(queryByTestId('select-form-form')).not.toBeNull()

    expect(queryByText('Subcategorie')).not.toBeNull()
    expect(queryByTestId('category_url').value).not.toBeNull()
    expect(queryByTestId('category_url').value).toEqual(subcategories[0].key)

    expect(queryByText('Status')).not.toBeNull()
    expect(queryByText('Afgehandeld')).not.toBeNull()
    expect(queryByDisplayValue('o')).not.toBeNull()
    expect(queryByText('Ingepland')).not.toBeNull()
    expect(queryByText('Heropend')).not.toBeNull()
  })

  describe('events', () => {
    it('should trigger fetch default texts on load', () => {
      render(withAppContext(<SelectForm {...props} />))

      expect(props.onFetchDefaultTexts).toHaveBeenCalledWith({
        category_url,
        state: 'o',
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      })
    })

    it('should trigger fetch default texts when a new status has been selected', () => {
      const { getByDisplayValue } = render(
        withAppContext(<SelectForm {...props} />)
      )
      const newStatus = 'ingepland'
      fireEvent.click(getByDisplayValue(newStatus))

      expect(props.onFetchDefaultTexts).toHaveBeenCalledWith({
        category_url,
        state: newStatus,
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      })
    })

    it('should NOT trigger fetch when no matching category can be found', () => {
      jest
        .spyOn(
          categoriesSelectors,
          'makeSelectSubcategoriesGroupedByCategories'
        )
        .mockImplementation(() => [null, []])
      const { getByDisplayValue } = render(
        withAppContext(<SelectForm {...props} />)
      )

      expect(props.onFetchDefaultTexts).not.toHaveBeenCalled()

      const newStatus = 'ingepland'
      fireEvent.click(getByDisplayValue(newStatus))

      expect(props.onFetchDefaultTexts).not.toHaveBeenCalled()
    })

    it('should trigger fetch default texts when a new category has been selected', () => {
      const { getByTestId } = render(withAppContext(<SelectForm {...props} />))

      const newCategory =
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu'
      const event = {
        target: {
          value: newCategory,
        },
      }
      fireEvent.change(getByTestId('category_url'), event)

      expect(props.onFetchDefaultTexts).toHaveBeenCalledWith({
        category_url: newCategory,
        state: 'o',
        sub_slug: 'asbest-accu',
        main_slug: 'afval',
      })
    })
  })
})
