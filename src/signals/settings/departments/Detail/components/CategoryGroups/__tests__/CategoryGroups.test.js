// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react'
import { render } from '@testing-library/react'
import categories from 'utils/__tests__/fixtures/categories_structured.json'
import { withAppContext } from 'test/utils'

import CategoryGroups from '..'
import DepartmentDetailContext from '../../../context'

const subCategories = Object.entries(categories).flatMap(([, { sub }]) => sub)

const findByMain = (parentKey) =>
  subCategories.filter((category) => category.parentKey === parentKey)

const onChange = jest.fn()
const onToggle = jest.fn()

const props = {
  boxWrapperKeyPrefix: 'pf',
  categories,
  findByMain,
  onChange,
  onToggle,
}

const withContextProvider = (Component) =>
  withAppContext(
    <DepartmentDetailContext.Provider
      value={{ categories, subCategories, findByMain }}
    >
      {Component}
    </DepartmentDetailContext.Provider>
  )

describe('signals/settings/departments/Detail/components/CategoryGroups', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render groups of checkboxes', () => {
    const { getAllByText } = render(
      withContextProvider(<CategoryGroups {...props} />)
    )

    expect(document.querySelectorAll('input[type=checkbox]')).toHaveLength(
      subCategories.length
    )

    expect(
      document.querySelectorAll('input[type=checkbox]:not(:checked)')
    ).toHaveLength(subCategories.length)

    Object.entries(categories).forEach(([, { name, slug }]) => {
      // elements with the same label are rendered, so we can't use getByText
      expect(getAllByText(name).length).toBeGreaterThan(0)

      expect(
        getAllByText(name)[0]
          .closest('[data-testid="checkboxList"]')
          .querySelectorAll('[type=checkbox]').length
      ).toEqual(categories[slug].sub.length)
    })
  })

  it('should render checked boxes based on the values from the state', () => {
    const state = {
      afval: [
        {
          id:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
          value: 'Container is vol',
          _links: {
            self: {
              public:
                'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/container-is-vol',
            },
          },
        },
        {
          id:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
          value: 'Huisafval',
          _links: {
            self: {
              href:
                'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
            },
          },
          disabled: true,
          parentKey:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval',
        },
      ],
      'openbaar-groen-en-water': [
        {
          id:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom',
          value: 'Boom - dood',
          _links: {
            self: {
              public:
                'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/boom',
            },
          },
        },
      ],
    }

    render(withContextProvider(<CategoryGroups {...props} state={state} />))

    expect(
      document.querySelectorAll('input[type=checkbox]:checked')
    ).toHaveLength(3)
  })
})
