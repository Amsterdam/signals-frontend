// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components'
import { Close } from '@amsterdam/asc-assets'

import Button from 'components/Button'

import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import IconList, { IconListItem } from '../../components/IconList'
import type { Item } from '../types'
import { FeatureType, Icon } from '../types'
import { getIconUrl } from '../../utils'

const ItemTextWrapper = styled.div<{ reported?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  left: ${({ reported }) => (reported ? themeSpacing(-1) : 0)};
`

const ItemText = styled.span`
  height: ${themeSpacing(6)};
`

const ItemSubText = styled.span`
  height: ${themeSpacing(6)};
  color: ${themeColor('secondary')};
`

const ItemWrapper = styled.div<{ reported?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: ${({ reported }) =>
    reported ? themeSpacing(3) : themeSpacing(0)};
`

const StyledButton = styled(Button).attrs(() => ({
  type: 'button',
  variant: 'blank',
  size: 32,
  iconSize: 12,
}))`
  margin-left: ${themeSpacing(2)};
  flex-shrink: 0;
  align-self: start;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  min-width: auto;
`

export interface SelectionListProps {
  selection: Item[]
  onRemove?: (id: string) => void
  className?: string
  featureTypes: Partial<FeatureType>[]
  icons: Icon[]
  showReportedInfo?: boolean
}

const SelectionList: FunctionComponent<SelectionListProps> = ({
  onRemove,
  selection,
  className,
  icons,
  featureTypes,
  showReportedInfo = false,
}) => {
  const items = useMemo(
    () =>
      selection.map(({ id, type, isReported, description }) => {
        const featureType = featureTypes.find(
          (featureType) => featureType.typeValue === type
        )

        const reported = showReportedInfo && isReported
        const iconId = reported
          ? featureType?.iconIsReportedId
          : featureType?.iconId
        const iconSvg = icons.find(({ id }) => id === iconId)?.icon

        return {
          id,
          label: `${description}${id ? ` - ${id}` : ''}`,
          iconUrl: getIconUrl(iconSvg),
          iconSize: reported ? 44 : 40,
          reported,
        }
      }),
    [featureTypes, icons, selection, showReportedInfo]
  )

  return (
    <IconList data-testid="selectionList" className={className}>
      {items.map((item) => (
        <IconListItem
          key={item.id}
          id={`selectionListItem-${item.id}`}
          iconUrl={item.iconUrl}
          iconSize={item.iconSize}
        >
          <ItemWrapper reported={item.reported}>
            <ItemTextWrapper reported={item.reported}>
              <ItemText>{item.label}</ItemText>
              {item.reported ? <ItemSubText>Is gemeld</ItemSubText> : null}
            </ItemTextWrapper>
            {onRemove && (
              <StyledButton
                data-testid={`selectionListRemove-${item.id}`}
                aria-label="Verwijder"
                icon={<Close />}
                onClick={() => {
                  onRemove(item.id)
                }}
              />
            )}
          </ItemWrapper>
        </IconListItem>
      ))}
    </IconList>
  )
}

export default SelectionList
