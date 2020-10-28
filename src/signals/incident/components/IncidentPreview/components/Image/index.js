import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { themeSpacing } from '@amsterdam/asc-ui';

const ImageContainer = styled.div`
  display: flex;
`;

const Thumbnail = styled.img`
  flex: 1 0 auto;
  display: block;
  height: auto;
  max-height: 100px;
  max-width: 100px;

  & + & {
    margin-left: ${themeSpacing(2)};
  }
`;

const Image = ({ value }) => (
  <ImageContainer>
    {value?.map(image => (
      <Thumbnail key={image} src={image} alt="" />
    ))}
  </ImageContainer>
);

Image.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
};

export default Image;
