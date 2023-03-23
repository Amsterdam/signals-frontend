// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Fragment } from 'react'

import { Paragraph } from '@amsterdam/asc-ui'

import { mapExtraPropertiesToJSX } from 'shared/services/map-extra-properties'
import type {
  ExtraPropertiesTypes,
  MappedLegacyItem,
} from 'shared/types/extraProperties'

import { FormTitle } from './styled'

interface Props {
  items?: ExtraPropertiesTypes
}

export const ExtraProperties = ({ items }: Props) => {
  if (!items) return null

  const itemList: ExtraPropertiesTypes | MappedLegacyItem[] = Array.isArray(
    items
  )
    ? items
    : Object.entries(items).map(([question, answer], index) => ({
        label: question,
        answer,
        id: index.toString(),
      }))

  return (
    <>
      {itemList.map((item) => (
        <Fragment key={item.id}>
          <FormTitle>{item.label}</FormTitle>
          <Paragraph strong>{mapExtraPropertiesToJSX(item.answer)}</Paragraph>
        </Fragment>
      ))}
    </>
  )
}
