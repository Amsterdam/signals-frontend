// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import IconList, { IconListItem } from 'components/IconList/IconList'

import { ScrollWrapper, Title } from '../styled'
import { Panel, CloseBtn } from './styled'

export interface LegendPanelProps {
  className?: string
  items: { id: string; iconUrl: string; label: string }[]
  onClose: () => void
  slide?: 'in' | 'out'
}

const LegendPanel: FunctionComponent<LegendPanelProps> = ({
  className,
  items,
  onClose,
  slide = 'out',
}) => (
  <Panel
    className={`${className} ${slide}`}
    data-testid="legendPanel"
    slide={slide}
  >
    <Title>Uitleg</Title>

    <CloseBtn title="Sluit uitleg" onClick={onClose} />

    <ScrollWrapper>
      <IconList data-testid="legendPanelList">
        {items.map((item) => (
          <IconListItem
            id={`legendPanelListItem-${item.id}`}
            key={item.id}
            iconUrl={item.iconUrl}
          >
            {item.label}
          </IconListItem>
        ))}
      </IconList>
    </ScrollWrapper>
  </Panel>
)

export default LegendPanel
