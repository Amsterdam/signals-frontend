// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { themeColor, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Info = styled(Paragraph)`
  color: ${themeColor('tint', 'level5')};
  margin: ${themeSpacing(2, 0, 6)};
  font-size: 1rem;
`

const InfoText = ({ className, text, ...rest }) => (
  <Info className={className} data-testid="info-text" {...rest}>
    {text}
  </Info>
)

InfoText.defaultProps = {
  className: '',
}

InfoText.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
}

export default InfoText
