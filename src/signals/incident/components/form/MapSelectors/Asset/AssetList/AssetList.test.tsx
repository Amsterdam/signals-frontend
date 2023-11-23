// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { HTMLAttributes, PropsWithChildren } from 'react'

import { render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'

import type { IconListItemProps } from 'components/IconList/IconList'
import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'
import { selection } from 'utils/__tests__/fixtures/caterpillarsSelection'

import MockInstance = jest.MockInstance
import type { AssetListProps } from './AssetList'
import AssetList from './AssetList'
import { AssetListItem } from './AssetListItem'
import type configurationType from '../../../../../../../shared/services/configuration/__mocks__/configuration'
import type { Item } from '../../types'
import { FeatureStatus } from '../../types'
import withAssetSelectContext, {
  contextValue,
} from '../__tests__/withAssetSelectContext'

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

jest.mock('shared/services/configuration/configuration')

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
  }: PropsWithChildren<IconListItemProps>) => {
    return (
      <li data-testid={id} {...props}>
        {children}
      </li>
    )
  },
}))

const mockConfiguration = configuration as typeof configurationType

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
    remove: jest.fn(),
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
    selectableFeatures: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: '123',
          properties: {
            fractie_omschrijving: 'Rest',
            id: '123',
            type: 'Rest',
            status: FeatureStatus.REPORTED,
            label: 'Rest container - 123',
          },
          geometry: {
            type: 'Point',
            coordinates: [1, 2],
          },
        },
      ],
    },
    objectTypePlural: 'objecten',
  }

  const reportedProps: AssetListProps = {
    remove: jest.fn(),
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

      mockConfiguration.__reset()
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
      expect(screen.queryByTestId('asset-list-item')).not.toBeInTheDocument()

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
      expect(screen.getByTestId('asset-list-item')).toBeInTheDocument()
    })

    it('renders a selection and selectable items', () => {
      mockConfiguration.featureFlags.showSelectorV2removeafterfinishepic5440 =
        true
      render(withAppContext(<AssetList {...props} />))

      expect(screen.getByTestId('asset-list')).toBeInTheDocument()
      expect(screen.getByTestId('asset-list-item')).toBeInTheDocument()

      expect(
        screen.getByTestId('asset-list-item-selectable')
      ).toBeInTheDocument()

      if (props.selection) {
        expect(
          screen.getByTestId(`asset-list-item-${props.selection[0].id}`)
        ).toBeInTheDocument()
      }
    })

    it('should not render selectable items when the features are not correct', () => {
      mockConfiguration.featureFlags.showSelectorV2removeafterfinishepic5440 =
        true
      const propsCurrent = { ...props, zoomLevel: 14 }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      propsCurrent.selectableFeatures = []
      propsCurrent.selection = []

      render(withAppContext(<AssetList {...propsCurrent} />))

      expect(
        screen.queryByTestId('asset-list-item-selectable')
      ).not.toBeInTheDocument()

      expect(
        screen.getByText(
          'Er zijn geen objecten in de buurt. Versleep de kaart om de objecten te zien.'
        )
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
            screen.getByTestId(`asset-list-item-${id}-has-status`)
          ).toBeInTheDocument()
        } else {
          expect(
            screen.queryByTestId(`asset-list-item-${id}-has-status`)
          ).not.toBeInTheDocument()
        }
      })
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
