import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, Heading, styles, themeSpacing } from '@datapunt/asc-ui';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { historyType } from 'shared/types';

const H2 = styled(Heading)`
  ${styles.HeaderStyles} {
    margin: ${themeSpacing(2)} 0;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  margin-bottom: ${themeSpacing(4)};
  display: grid;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    grid-template-columns: 2fr ${({ theme }) => theme.layouts.medium.gutter}px 4fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    grid-template-columns: 3fr ${({ theme }) => theme.layouts.large.gutter}px 4fr;
  }
`;

const Time = styled.div`
  color: ${themeColor('tint', 'level5')};
`;

const Action = styled.div`
  color: ${themeColor('tint', 'level7')};
  white-space: pre-wrap;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    grid-column-start: 3;
  }
`;

const History = ({ className, list }) =>
  list?.length > 0 && (
    <section className={className} data-testid="history">
      <H2 forwardedAs="h2" styleAs="h4">
        Geschiedenis
      </H2>

      <List>
        {list.map(({ identifier, when, who, action, description }) => (
          <Item key={identifier}>
            <Time>
              {string2date(when)} om {string2time(when)}
              <div>{who}</div>
            </Time>

            <Action>
              {action}
              {description && <div data-testid="history-list-item-description">{description}</div>}
            </Action>
          </Item>
        ))}
      </List>
    </section>
  );

History.defaultProps = {
  className: '',
};

History.propTypes = {
  className: PropTypes.string,
  list: historyType.isRequired,
};

export default History;
