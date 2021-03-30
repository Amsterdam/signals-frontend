import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, styles, themeSpacing } from '@amsterdam/asc-ui';

import { historyType } from 'shared/types';
import HistoryList from 'components/HistoryList';

const H2 = styled(Heading)`
  ${styles.HeaderStyles} {
    margin: ${themeSpacing(2)} 0;
  }
`;

const History = ({ className, list }) =>
  list.length > 0 ? (
    <section className={className} data-testid="history">
      <H2 forwardedAs="h2" styleAs="h4">
        Geschiedenis
      </H2>

      <HistoryList list={list} />
    </section>
  ) : null;

History.defaultProps = {
  className: '',
};

History.propTypes = {
  className: PropTypes.string,
  list: historyType.isRequired,
};

export default History;
