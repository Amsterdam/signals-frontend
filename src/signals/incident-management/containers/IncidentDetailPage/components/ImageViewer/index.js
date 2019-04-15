import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const ImageViewer = ({ image, onClose }) => (
  <div className="image-viewer">
    <button className="image-viewer__button action-button-close" onClick={onClose}>X</button>
    <img src={image} className="image-viewer__image" alt="uploaded afbeelding" />
  </div>
);

ImageViewer.propTypes = {
  image: PropTypes.string.isRequired,

  onClose: PropTypes.func.isRequired
};

export default ImageViewer;
