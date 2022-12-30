// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { Heading, Row, themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import BackLinkComponent from 'components/BackLink'

const StyledSection = styled.section`
  contain: content;
  padding-top: ${themeSpacing(6)};
  padding-bottom: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(5)};

  ${({ hasBackLink }) =>
    hasBackLink &&
    css`
      h1 {
        margin-top: ${themeSpacing(3)};
      }
    `}
`

const StyledHeading = styled(Heading)`
  margin: 0;
  line-height: 44px;
`

const PageHeader = ({ BackLink, className, children, title }) => (
  <StyledSection
    data-testid="settings-page-header"
    className={className}
    hasBackLink={Boolean(BackLink)}
  >
    <Row>
      <div>
        {BackLink}
        <StyledHeading>{title}</StyledHeading>
      </div>

      {children}
    </Row>
  </StyledSection>
)

PageHeader.defaultProps = {
  BackLink: null,
  className: '',
  children: null,
}

PageHeader.propTypes = {
  BackLink: PropTypes.objectOf(BackLinkComponent),
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.node.isRequired,
}

export default PageHeader
