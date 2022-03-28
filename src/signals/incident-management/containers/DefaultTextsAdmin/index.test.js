// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import { defaultTextsOptionList } from 'signals/incident-management/definitions/statusList'
import * as categoriesSelectors from 'models/categories/selectors'
import {
  subCategories,
  subcategoriesGroupedByCategories,
} from 'utils/__tests__/fixtures'

import userEvent from '@testing-library/user-event'
import DefaultTextsAdmin, { DefaultTextsAdminContainer } from '.'

Enzyme.configure({ adapter: new Adapter() })

describe('<DefaultTextsAdmin />', () => {
  let props

  beforeEach(() => {
    props = {
      defaultTextsAdmin: {
        defaultTexts: [
          {
            title: 'Accu',
            text: 'accutekst',
          },
          {
            title: 'Accu 2',
            text: 'accutekst 2',
          },
        ],
        defaultTextsOptionList,
        categoryUrl:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
        state: 'o',
      },
      categories: {},
      onFetchDefaultTexts: jest.fn(),
      onSubmitTexts: jest.fn(),
      onOrderDefaultTexts: jest.fn(),
      onSaveDefaultTextsItem: jest.fn(),
    }
    jest
      .spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories')
      .mockImplementation(() => subcategoriesGroupedByCategories)
  })

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<DefaultTextsAdmin />))

    const containerProps = tree.find(DefaultTextsAdminContainer).props()

    expect(containerProps.defaultTextsAdmin).toBeDefined()
    expect(containerProps.subCategories).not.toBeUndefined()
  })

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<DefaultTextsAdmin />))

    const containerProps = tree.find(DefaultTextsAdminContainer).props()

    expect(containerProps.onFetchDefaultTexts).not.toBeUndefined()
    expect(typeof containerProps.onFetchDefaultTexts).toEqual('function')

    expect(containerProps.onSubmitTexts).not.toBeUndefined()
    expect(typeof containerProps.onSubmitTexts).toEqual('function')

    expect(containerProps.onOrderDefaultTexts).not.toBeUndefined()
    expect(typeof containerProps.onOrderDefaultTexts).toEqual('function')
  })

  describe('rendering', () => {
    it('should render correctly', () => {
      const { rerender } = render(
        withAppContext(
          <DefaultTextsAdminContainer {...props} subCategories={undefined} />
        )
      )

      expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
      expect(
        screen.queryByTestId('defaultTextFormForm0')
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId('selectFormForm')).not.toBeInTheDocument()

      rerender(
        withAppContext(
          <DefaultTextsAdminContainer
            {...props}
            subCategories={subCategories}
          />
        )
      )

      expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
      expect(screen.getByTestId('defaultTextFormForm0')).toBeInTheDocument()
      expect(screen.getByTestId('selectFormForm')).toBeInTheDocument()

      const index = 1
      userEvent.click(screen.getByTestId(`defaultTextFormItemButton${index}Up`))

      expect(props.onOrderDefaultTexts).toHaveBeenCalledWith({
        index,
        type: 'up',
      })
    })

    it('should not render the texts form without categoryUrl', () => {
      render(
        withAppContext(
          <DefaultTextsAdminContainer
            {...{
              ...props,
              defaultTextsAdmin: {
                ...props.defaultTextsAdmin,
                categoryUrl: '',
              },
            }}
            subCategories={subCategories}
          />
        )
      )

      expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('defaultTextFormForm')
      ).not.toBeInTheDocument()
      expect(screen.getByTestId('selectFormForm')).toBeInTheDocument()
    })

    it('should not render the texts form when loading', () => {
      render(
        withAppContext(
          <DefaultTextsAdminContainer
            {...{
              ...props,
              defaultTextsAdmin: {
                ...props.defaultTextsAdmin,
                loading: true,
              },
            }}
            subCategories={subCategories}
          />
        )
      )

      expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('defaultTextFormForm')
      ).not.toBeInTheDocument()
      expect(screen.getByTestId('selectFormForm')).toBeInTheDocument()
    })

    it('should not render the texts on error', () => {
      render(
        withAppContext(
          <DefaultTextsAdminContainer
            {...{
              ...props,
              defaultTextsAdmin: {
                ...props.defaultTextsAdmin,
                error: true,
              },
            }}
            subCategories={subCategories}
          />
        )
      )

      expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('defaultTextFormForm')
      ).not.toBeInTheDocument()
      expect(screen.getByTestId('selectFormForm')).toBeInTheDocument()
    })
  })
})
