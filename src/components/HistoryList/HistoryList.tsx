// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Markdown from 'components/Markdown'
import { string2date, string2time } from 'shared/services/string-parser'
import type { History } from 'types/history'
import type { Theme } from 'types/theme'

const List = styled.ul`
  margin: 0;
  padding: 0;
`

const Item = styled.li`
  &:not(:last-child) {
    margin-bottom: ${themeSpacing(4)};
  }
  display: grid;

  span {
    display: block;
  }

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-template-columns: 2fr ${({ theme }: { theme: Theme }) =>
        theme.layouts.medium.gutter}px 4fr;
  }

  @media ${breakpoint('min-width', 'laptop')} {
    grid-template-columns: 3fr ${({ theme }: { theme: Theme }) =>
        theme.layouts.large.gutter}px 4fr;
  }
`

const Time = styled.div`
  color: ${themeColor('tint', 'level5')};
`

const Action = styled.div`
  color: ${themeColor('tint', 'level7')};
  white-space: pre-line;
  overflow-wrap: anywhere;

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-column-start: 3;
  }
`

const Who = styled.div`
  word-break: break-all;
`

interface HistoryListProps {
  list: History[]
  className?: string
}

const HistoryList: FunctionComponent<HistoryListProps> = ({
  list,
  className,
}) => (
  <List className={className}>
    {list.map(({ identifier, when, who, action, description }) => {
      return (
        <Item key={`${identifier}-${when}`}>
          <Time>
            {string2date(when)} om {string2time(when)}
            <Who>{who}</Who>
          </Time>

          <Action>
            {action && (
              <span data-testid="history-list-item-action">
                <Markdown allowedElements={['a', 'p']}>{action}</Markdown>
              </span>
            )}
            {description && (
              <span data-testid="history-list-item-description">
                <Markdown allowedElements={['a', 'p', 'ul', 'ol', 'li']}>
                  {description}
                </Markdown>
              </span>
            )}
          </Action>
        </Item>
      )
    })}
  </List>
)

export default HistoryList
