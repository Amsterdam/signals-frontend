// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 -2022 Gemeente Amsterdam
import { Fragment } from 'react'
import type { FunctionComponent } from 'react'

import { mapExtraPropertiesToJSX } from 'shared/services/map-extra-properties'
import type {
  MappedLegacyItem,
  Item,
  ExtraPropertiesTypes,
} from 'shared/types/extraProperties'

interface ExtraPropertiesProps {
  items?: ExtraPropertiesTypes
}

const ExtraProperties: FunctionComponent<ExtraPropertiesProps> = ({
  items = [],
}) => {
  // Some incidents have been stored with values for their extra properties that is incompatible with the current API
  // We therefore need to check if we're getting an array or an object
  const itemList: (Item | MappedLegacyItem)[] = Array.isArray(items)
    ? items
    : Object.entries(items).map(([question, answer], index) => ({
        label: question,
        answer,
        id: index.toString(),
      }))

  return (
    <Fragment>
      {itemList.map((item) => (
        <Fragment key={item.id}>
          <dt data-testid="extra-properties-definition">{item.label}</dt>
          <dd data-testid="extra-properties-value">
            {mapExtraPropertiesToJSX(item.answer)}
          </dd>
        </Fragment>
      ))}
    </Fragment>
  )
}

export default ExtraProperties
