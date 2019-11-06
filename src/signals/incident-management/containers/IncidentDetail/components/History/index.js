import React from 'react';

import styled from '@datapunt/asc-core'
import { themeColor, Heading, styles, Row } from '@datapunt/asc-ui'
import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { historyType } from 'shared/types';

const StyledHistoryListItem = styled(Row)`
  margin : 0 -15px 16px;
  padding: 0;
  line-height: 22px;
`;

const StyledHistoryItemLeft = styled.div`
  color: ${themeColor('tint', 'level5')};
`;

const StyledHistoryItemRight = styled(StyledHistoryItemLeft)`
  color: ${themeColor('tint', 'level7')};
`;

const StyledH4 = styled(Heading)`
  ${styles.HeaderStyles} {
    margin-top: 1.33em;
    margin-bottom: 1.33em;
  }
`;

const History = ({ list }) => (
  <section className="history">
    <StyledH4 $as="h4" data-testid="history-title">Geschiedenis</StyledH4>

    {list.map(item => (
      <StyledHistoryListItem key={item.identifier} data-testid="history-list-item" >
        <StyledHistoryItemLeft className="col-5">
          <span data-testid="history-list-item-when">
            {string2date(item.when)} om {string2time(item.when)}
          </span>
          <div data-testid="history-list-item-who">{item.who}</div>
        </StyledHistoryItemLeft>
        <StyledHistoryItemRight className="col-7 pre-wrap">
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
