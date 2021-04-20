// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'

import { store, withAppContext } from 'test/utils'
import categoriesPrivateFixture from 'utils/__tests__/fixtures/categories_private.json'
import { fetchCategoriesSuccess } from 'models/categories/actions'
import { makeSelectSubCategories } from 'models/categories/selectors'
import { statusList } from 'signals/incident-management/definitions'

import DefaultTextsForm from '.'

store.dispatch(fetchCategoriesSuccess(categoriesPrivateFixture))

const subCategories = makeSelectSubCategories(store.getState())

describe('<DefaultTextsForm />', () => {
  let props

  beforeEach(() => {
    props = {
      defaultTexts: [
        {
          title: 'title 1',
          text: 'text 1',
        },
        {
          title: 'title 2',
          text: 'text 2',
        },
        {
          title: 'title 3',
          text: 'text 3',
        },
      ],
      subCategories,
      categoryUrl:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
      state: 'o',

      onSubmitTexts: jest.fn(),
      onOrderDefaultTexts: jest.fn(),
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render form correctly', () => {
    props.defaultTexts = []
    const fields = [...Array(10).keys()]
    const { queryByTestId } = render(
      withAppContext(<DefaultTextsForm {...props} />)
    )

    expect(queryByTestId('defaultTextFormForm')).not.toBeNull()

    fields.forEach((i) => {
      expect(queryByTestId(`title${i}`)).not.toBeNull()
      expect(queryByTestId(`text${i}`)).not.toBeNull()
      expect(queryByTestId(`defaultTextFormItemButton${i}Up`)).toBeDisabled()
      expect(queryByTestId(`defaultTextFormItemButton${i}Down`)).toBeDisabled()
    })

    expect(queryByTestId('defaultTextFormSubmitButton')).not.toBeNull()
    expect(queryByTestId('defaultTextFormSubmitButton')).not.toBeDisabled()
  })

  it('should render disabled ordering buttons whith 3 items defined correctly', () => {
    const { queryByTestId } = render(
      withAppContext(<DefaultTextsForm {...props} />)
    )

    expect(queryByTestId('defaultTextFormItemButton0Up')).toBeDisabled()
    expect(queryByTestId('defaultTextFormItemButton0Down')).not.toBeDisabled()
    expect(queryByTestId('defaultTextFormItemButton1Up')).not.toBeDisabled()
    expect(queryByTestId('defaultTextFormItemButton1Down')).not.toBeDisabled()
    expect(queryByTestId('defaultTextFormItemButton2Up')).not.toBeDisabled()
    expect(queryByTestId('defaultTextFormItemButton2Down')).toBeDisabled()
    expect(queryByTestId('defaultTextFormItemButton3Up')).toBeDisabled()
    expect(queryByTestId('defaultTextFormItemButton3Down')).toBeDisabled()
  })

  describe('events', () => {
    it('should trigger order default texts when ordering up and down button was called', () => {
      const { getByTestId } = render(
        withAppContext(<DefaultTextsForm {...props} />)
      )

      act(() => {
        fireEvent.click(getByTestId('defaultTextFormItemButton1Down'))
      })

      expect(props.onOrderDefaultTexts).toHaveBeenCalledWith({
        index: 1,
        type: 'down',
      })

      act(() => {
        fireEvent.click(getByTestId('defaultTextFormItemButton1Up'))
      })

      expect(props.onOrderDefaultTexts).toHaveBeenCalledWith({
        index: 1,
        type: 'up',
      })
    })

    it('should NOT trigger fetch when no matching category can be found', () => {
      const invalidSubCategories = subCategories.map((subCat) => ({
        ...subCat,
        _links: undefined,
      }))

      const { getByTestId } = render(
        withAppContext(
          <DefaultTextsForm {...props} subCategories={invalidSubCategories} />
        )
      )

      expect(props.onSubmitTexts).not.toHaveBeenCalled()

      act(() => {
        fireEvent.click(getByTestId('defaultTextFormSubmitButton'))
      })

      expect(props.onSubmitTexts).not.toHaveBeenCalled()
    })

    it('should trigger order submit when sumbit button is clicked', () => {
      const { getByTestId } = render(
        withAppContext(<DefaultTextsForm {...props} />)
      )

      act(() => {
        fireEvent.click(getByTestId('defaultTextFormSubmitButton'))
      })

      const status = statusList.find(({ key }) => key === 'o')
      const subcategory = subCategories.find(
        ({ slug }) => slug === 'asbest-accu'
      )

      expect(props.onSubmitTexts).toHaveBeenCalledWith({
        main_slug: 'afval',
        subcategory,
        status,
        post: {
          state: 'o',
          templates: props.defaultTexts,
        },
      })
    })
  })
})
