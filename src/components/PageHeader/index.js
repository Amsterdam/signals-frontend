// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Heading, Row, Paragraph, themeSpacing } from '@amsterdam/asc-ui'

const StyledSection = styled.section`
  background-color: #f3f3f3;
  padding-top: ${themeSpacing(6)};
  padding-bottom: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(5)};
`

const StyledHeading = styled(Heading)`
  font-weight: 400;
  margin: 0;
`

const SubTitle = styled(Paragraph)`
  margin-bottom: 0;
`

const PageHeader = ({ className, children, subTitle, title }) => (
  <StyledSection className={className}>
    <Row>
      <div>
        <StyledHeading>{title}</StyledHeading>
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
      </div>

      {children}
    </Row>
  </StyledSection>
)

PageHeader.defaultProps = {
  className: '',
  children: null,
  subTitle: '',
}

PageHeader.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.node.isRequired,
}

export default PageHeader
