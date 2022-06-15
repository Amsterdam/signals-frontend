// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Heading, styles, themeSpacing } from '@amsterdam/asc-ui'

import { historyType } from 'shared/types'
import HistoryList from 'components/HistoryList'

const Section = styled.section`
  contain: centent;
`

const H2 = styled(Heading)`
  ${styles.HeaderStyles} {
    margin: ${themeSpacing(4)} 0 ${themeSpacing(2)};
  }
`

const History = ({ className, list }) =>
  list.length > 0 ? (
    <Section className={className} data-testid="history">
      <H2 forwardedAs="h2" styleAs="h4">
        Geschiedenis
      </H2>

      <HistoryList list={list} />
    </Section>
  ) : null

History.defaultProps = {
  className: '',
}

History.propTypes = {
  className: PropTypes.string,
  list: historyType.isRequired,
}

export default History
