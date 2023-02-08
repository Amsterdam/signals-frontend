// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ImageContainer = styled.div`
  display: flex;
`

const Thumbnail = styled.img`
  flex: 1 0 auto;
  display: block;
  height: auto;
  max-height: 100px;
  max-width: 100px;

  & + & {
    margin-left: ${themeSpacing(2)};
  }
`

const Image = ({ value }) => (
  <ImageContainer>
    {value?.map((image) => (
      <Thumbnail key={image} src={image} alt="" />
    ))}
  </ImageContainer>
)

Image.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
}

export default Image
