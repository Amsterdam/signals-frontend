// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { withAppContext } from 'test/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { selection } from 'utils/__tests__/fixtures/caterpillarsSelection'

import type { IconListItemProps } from 'components/IconList/IconList'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import configuration from 'shared/services/configuration/configuration'
import useFetch from 'hooks/useFetch'
import * as reactRedux from 'react-redux'
import type { Item } from '../../types'
import { FeatureStatus } from '../../types'
import withAssetSelectContext, {
  contextValue,
} from '../__tests__/withAssetSelectContext'
import AssetList from './AssetList'
import type { AssetListProps } from './AssetList'
import { AssetListItem } from './AssetList'
import MockInstance = jest.MockInstance

const del = jest.fn()
const get = jest.fn()
const patch = jest.fn()
const post = jest.fn()
const put = jest.fn()
const dispatch = jest.fn()

const useFetchResponse = {
  del,
  get,
  patch,
  post,
  put,
  data: undefined,
  isLoading: false,
  error: false,
  isSuccess: false,
}
jest.mock('hooks/useFetch')
jest.mock('components/IconList/IconList', () => ({
  __esModule: true,
  default: ({ children, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul {...props}>{children}</ul>
  ),
  IconListItem: ({
    children,
    iconUrl,
    featureStatusType,
    id,
    ...props
  }: PropsWithChildren<IconListItemProps>) => (
    <li data-testid={id} {...props}>
      {children}
    </li>
  ),
}))

describe('AssetList', () => {
  const featureTypes = [
    {
      label: 'Restafval',
      description: 'Restafval container',
      icon: {
        options: {},
        iconUrl: '',
      },
      idField: 'id_nummer',
      typeField: 'fractie_omschrijving',
      typeValue: 'Rest',
    },
  ]

  const featureStatusTypes = [
    {
      label: 'Is gemeld',
      description: 'Object is reeds gemeld',
      icon: {
        options: {},
        iconUrl: '',
      },
      idField: 'OBJECTID',
      typeValue: FeatureStatus.REPORTED,
      typeField: '',
      statusField: 'AMS_Meldingstatus',
      statusValues: [1],
    },
  ]
  const props: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: featureTypes,
    featureStatusTypes,
    selection: [
      {
        description: 'Description',
        id: '234',
        type: 'Rest',
        location: {},
        label: 'Rest container - 234',
        coordinates: { lat: 1, lng: 2 },
      },
    ],
  }

  const reportedProps: AssetListProps = {
    onRemove: jest.fn(),
    featureTypes: featureTypes,
    featureStatusTypes,
    selection,
  }

  const category = 'afval'
  const subcategory = 'huisvuil'

  describe('AssetListItem', () => {
    beforeEach(() => {
      jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
      const dispatchEventSpy: MockInstance<any, any> = jest.spyOn(
        global.document,
        'dispatchEvent'
      )
      dispatch.mockReset()
      dispatchEventSpy.mockReset()

      jest
        .spyOn(reactRedux, 'useSelector')
        .mockReturnValue({ category, subcategory })
      jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('does not render with empty selection props', () => {
      const emptyIdProps = {
        ...props,
        selection: [
          {
            id: '',
            label: 'Here be a label',
            location: {},
          },
        ],
      }

      const { rerender } = render(
        withAppContext(<AssetList {...emptyIdProps} />)
      )
      expect(screen.queryByTestId('assetListItem')).not.toBeInTheDocument()

      const emptyLabelProps = {
        ...props,
        selection: [
          {
            id: '2983764827364',
            label: '',
            location: {},
          },
        ],
      }

      rerender(withAppContext(<AssetList {...emptyLabelProps} />))
      expect(screen.getByTestId('assetListItem')).toBeInTheDocument()
    })

    it('renders a selection', () => {
      render(withAppContext(<AssetList {...props} />))

      expect(screen.getByTestId('assetList')).toBeInTheDocument()
      expect(
        screen.getByTestId(`assetListItem-${props.selection[0].id}`)
      ).toBeInTheDocument()
    })

    it('shows reported items', () => {
      selection.forEach((selected: Item) => {
        const { id, status } = selected
        render(
          withAppContext(
            <AssetListItem
              {...reportedProps}
              item={{ ...selected, location: {} }}
            />
          )
        )

        if (
          status === FeatureStatus.REPORTED ||
          status === FeatureStatus.CHECKED
        ) {
          expect(
            screen.getByTestId(`assetListItem-${id}-hasStatus`)
          ).toBeInTheDocument()
        } else {
          expect(
            screen.queryByTestId(`assetListItem-${id}-hasStatus`)
          ).not.toBeInTheDocument()
        }
      })
    })

    it('calls onRemove handler', () => {
      render(withAppContext(<AssetList {...props} />))

      const button = screen.getByRole('button')

      expect(props.onRemove).not.toHaveBeenCalled()

      userEvent.click(button)

      expect(props.onRemove).toHaveBeenCalled()
    })

    it('sends an API request, when an object is selected on the map, to get incidents with equal coordinates', async () => {
      expect(get).not.toHaveBeenCalled()
      render(
        withAssetSelectContext(<AssetList {...props} />, {
          ...contextValue,
        })
      )

      expect(get).toHaveBeenCalledTimes(1)
      expect(get).toHaveBeenCalledWith(
        expect.stringContaining(configuration.GEOGRAPHY_PUBLIC_ENDPOINT)
      )
    })
  })
})
