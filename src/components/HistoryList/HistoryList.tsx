// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import type { FunctionComponent } from 'react';
import type { History } from 'types/history';
import styled from 'styled-components';
import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui';
import { string2date, string2time } from 'shared/services/string-parser';
import type { Theme } from 'types/theme';

const List = styled.ul`
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  margin-bottom: ${themeSpacing(4)};
  display: grid;

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-template-columns: 2fr ${({ theme }: { theme: Theme }) => theme.layouts.medium.gutter}px 4fr;
  }

  @media ${breakpoint('min-width', 'laptop')} {
    grid-template-columns: 3fr ${({ theme }: { theme: Theme }) => theme.layouts.large.gutter}px 4fr;
  }
`;

const Time = styled.div`
  color: ${themeColor('tint', 'level5')};
`;

const Action = styled.div`
  color: ${themeColor('tint', 'level7')};
  white-space: pre-line;

  @media ${breakpoint('min-width', 'tabletM')} {
    grid-column-start: 3;
  }
`;

interface HistoryListProps {
  list: History[];
  className?: string;
}

const HistoryList: FunctionComponent<HistoryListProps> = ({ list, className }) => (
  <List className={className}>
    {list.map(({ identifier, when, who, action, description }) => (
      <Item key={identifier}>
        <Time>
          {string2date(when)} om {string2time(when)}
          <div>{who}</div>
        </Time>

        <Action>
          {action && <div data-testid="history-list-item-action">{action}</div>}
          {description && <div data-testid="history-list-item-description">{description}</div>}
        </Action>
      </Item>
    ))}
  </List>
);

export default HistoryList;
