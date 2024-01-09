// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021- 2023 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import IconList, { IconListItem } from 'components/IconList/IconList'

import { Panel, CloseBtn } from './styled'
import { ScrollWrapper, Title } from '../styled'

export interface LegendPanelProps {
  className?: string
  items: { id: string; iconUrl: string; label: string }[]
  onClose: () => void
  slide?: 'in' | 'out'
  buttonRef: React.ForwardedRef<HTMLButtonElement>
}

const LegendPanel: FunctionComponent<LegendPanelProps> = ({
  className,
  items,
  onClose,
  slide = 'out',
  buttonRef,
}) => (
  <Panel
    className={`${className} ${slide}`}
    data-testid="legend-panel"
    id="legendPanel"
    slide={slide}
  >
    <Title>Legenda</Title>

    <CloseBtn
      data-testid="close-button"
      ref={buttonRef}
      tabIndex={-1}
      title="Sluit legenda"
      onClick={onClose}
    />

    <ScrollWrapper>
      <IconList data-testid="legendPanelList">
        {items.map((item) => (
          <IconListItem
            id={`legendPanelListItem-${item.id}`}
            key={item.id}
            iconUrl={item.iconUrl}
            checkboxDisabled
          >
            {item.label}
          </IconListItem>
        ))}
      </IconList>
    </ScrollWrapper>
  </Panel>
)

export default LegendPanel
