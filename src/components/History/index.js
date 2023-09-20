// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { Heading, styles, themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import HistoryList from 'components/HistoryList'
import { historyType } from 'shared/types'

const Section = styled.section`
  contain: content;
  margin-top: ${themeSpacing(8)};
`

const H2 = styled(Heading)`
  ${styles.HeaderStyle} {
    margin: ${themeSpacing(4, 0, 2)};
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
