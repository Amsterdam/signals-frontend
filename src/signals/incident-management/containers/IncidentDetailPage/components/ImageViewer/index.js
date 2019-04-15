import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const ImageViewer = ({ image }) => (
  <div className="image-viewer">
    <img src={image} className="image-viewer__image" alt="uploaded afbeelding" />
  </div>
);

ImageViewer.propTypes = {
  image: PropTypes.string.isRequired,
};

export default ImageViewer;
