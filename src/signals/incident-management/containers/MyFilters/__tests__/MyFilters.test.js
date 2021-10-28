// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import * as definitions from 'signals/incident-management/definitions'

import { withAppContext } from 'test/utils'
import MyFilters, { MyFiltersComponent } from '..'

Enzyme.configure({ adapter: new Adapter() })

jest.mock('signals/shared/filter/parse', () => {
  const actual = jest.requireActual('signals/shared/filter/parse')

  return {
    __esModule: true,
    ...actual,
    parseToAPIData: (data) => data,
  }
})

describe('signals/incident-management/containers/MyFilters', () => {
  const filter1 = {
    id: 1234,
    name: 'Foo bar baz',
    options: {
      status: [definitions.statusList[1]],
      feedback: '',
      priority: [{ key: 'normal', value: 'Normaal' }],
      stadsdeel: [definitions.stadsdeelList[0], definitions.stadsdeelList[1]],
      address_text: '',
      incident_date: '2019-09-17',
      category_slug: [
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
          value: 'Asbest / accu',
          slug: 'asbest-accu',
        },
      ],
    },
  }
  const filter2 = {
    id: 1235,
    name: 'Bar bar baz',
    options: {
      status: [definitions.statusList[0]],
      feedback: '',
      priority: [{ key: 'normal', value: 'Normaal' }],
      stadsdeel: [definitions.stadsdeelList[0], definitions.stadsdeelList[1]],
      address_text: '',
      incident_date: '2019-09-17',
      category_slug: [
        {
          key: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
          value: 'Asbest / accu',
          slug: 'asbest-accu',
        },
      ],
    },
  }
  const sortSpy = jest.spyOn(Array.prototype, 'sort')
  const filters = [filter1, filter2]

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<MyFilters onClose={() => {}} />))

    const props = tree.find(MyFiltersComponent).props()

    expect(props.filters).not.toBeUndefined()
    expect(props.onApplyFilter).not.toBeUndefined()
    expect(props.onEditFilter).not.toBeUndefined()
    expect(props.onRemoveFilter).not.toBeUndefined()
    expect(props.onUpdateFilter).not.toBeUndefined()
  })

  it('should show a message when there are no filters', () => {
    const { container } = render(
      withAppContext(
        <MyFiltersComponent
          onClose={() => {}}
          filters={[]}
          onApplyFilter={() => {}}
          onEditFilter={() => {}}
          onRemoveFilter={() => {}}
          onRequestIncidents={() => {}}
          onUpdateFilter={() => {}}
        />
      )
    )

    expect(container.querySelector('.my-filters--empty')).toBeTruthy()
  })

  it('should sort filters by name', () => {
    const { getByText } = render(
      withAppContext(
        <MyFiltersComponent
          onClose={() => {}}
          filters={filters}
          onApplyFilter={() => {}}
          onEditFilter={() => {}}
          onRemoveFilter={() => {}}
          onRequestIncidents={() => {}}
          onUpdateFilter={() => {}}
        />
      )
    )

    expect(sortSpy).toHaveBeenCalled()

    const firstFilter = getByText(filter1.name).closest('.filter-item')
    const secondFilter = getByText(filter2.name).closest('.filter-item')
    const myFilterChildNodes = [
      ...document.querySelector('.my-filters').childNodes,
    ]

    const firstIndex = myFilterChildNodes.indexOf(firstFilter)
    const secondIndex = myFilterChildNodes.indexOf(secondFilter)

    expect(firstIndex).toBeGreaterThan(secondIndex)
  })

  describe('action handling', () => {
    const props = {
      onClose: () => {},
      onApplyFilter: () => {},
      onEditFilter: () => {},
      onRemoveFilter: () => {},
      onRequestIncidents: () => {},
      onUpdateFilter: () => {},
      filters,
    }

    it('should handle applyFilter', () => {
      const onApplyFilter = jest.fn()
      const onEditFilter = jest.fn()
      const onRequestIncidents = jest.fn()
      const onUpdateFilter = jest.fn()

      render(
        withAppContext(
          <MyFiltersComponent
            {...{
              ...props,
              onApplyFilter,
              onEditFilter,
              onRequestIncidents,
              onUpdateFilter,
            }}
          />
        )
      )

      const handleApplyFilterButton = screen.getAllByTestId(
        'handleApplyFilterButton'
      )[0]

      const event = createEvent.click(handleApplyFilterButton, { button: 1 })

      fireEvent(handleApplyFilterButton, event)

      expect(onApplyFilter).toHaveBeenCalled()
    })

    it('should handle editFilter', () => {
      const createEventSpy = jest.spyOn(document, 'createEvent')
      const onEditFilter = jest.fn()

      const { getAllByTestId } = render(
        withAppContext(<MyFiltersComponent {...{ ...props, onEditFilter }} />)
      )

      const handleEditFilterButton = getAllByTestId('handleEditFilterButton')[0]
      const event = createEvent.click(handleEditFilterButton, { button: 1 })
      event.preventDefault = jest.fn()

      fireEvent(handleEditFilterButton, event)

      expect(onEditFilter).toHaveBeenCalled()
      expect(createEventSpy).toHaveBeenCalled()
    })

    it('should have a fallback for event creation', () => {
      const Event = global.Event
      global.Event = null
      const createEventSpy = jest.spyOn(document, 'createEvent')
      const onEditFilter = jest.fn()

      const { getAllByTestId } = render(
        withAppContext(<MyFiltersComponent {...{ ...props, onEditFilter }} />)
      )

      const handleEditFilterButton = getAllByTestId('handleEditFilterButton')[0]
      const event = createEvent.click(handleEditFilterButton, { button: 1 })
      event.preventDefault = jest.fn()

      fireEvent(handleEditFilterButton, event)

      expect(onEditFilter).toHaveBeenCalled()
      expect(createEventSpy).toHaveBeenCalled()

      global.Event = Event
    })
  })
})
