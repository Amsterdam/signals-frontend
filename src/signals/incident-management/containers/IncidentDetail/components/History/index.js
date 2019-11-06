import React from 'react';

import styled from '@datapunt/asc-core'
import { themeColor, Heading, styles, Column } from '@datapunt/asc-ui'
import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { historyType } from 'shared/types';

const StyledH4 = styled(Heading)`
  ${styles.HeaderStyles} {
    margin-top: 1.33em;
    margin-bottom: 1.33em;
  }
`;

const StyledHistoryListItem = styled(Column)`
  margin-bottom: 16px;
  line-height: 22px;
`;

const StyledHistoryItemLeft = styled(Column)`
  color: ${themeColor('tint', 'level5')};
  justify-content: flex-start;
  flex-direction: column;
`;

const StyledHistoryItemRight = styled(StyledHistoryItemLeft)`
  color: ${themeColor('tint', 'level7')};
  whitespace: pre-wrap;
`;

const History = ({ list }) => (
  <section className="history">
    <StyledH4 $as="h4" data-testid="history-title">Geschiedenis</StyledH4>

    {list.map(item => (
      <StyledHistoryListItem key={item.identifier} span={7} data-testid="history-list-item">
        <StyledHistoryItemLeft span={3}>
          <span data-testid="history-list-item-when">
            {string2date(item.when)} om {string2time(item.when)}
          </span>
          <div data-testid="history-list-item-who">{item.who}</div>
        </StyledHistoryItemLeft>
        <StyledHistoryItemRight span={4}>
          <div data-testid="history-list-item-action">{item.action}</div>
          <div data-testid="history-list-item-description">{item.description}</div>
        </StyledHistoryItemRight>
      </StyledHistoryListItem>
    ))}
  </section>
);

History.propTypes = {
  list: historyType.isRequired,
};

export default History;
