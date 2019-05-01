import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const ImageViewer = ({ image, attachments, onShowAttachment }) => {
  const index = attachments.findIndex((attachment) => attachment.location === image);
  const previous = index > 0 ? attachments[index - 1].location : false;
  const next = index < (attachments.length - 1) ? attachments[index + 1].location : false;

  return (
    <div className="image-viewer">
      {previous ?
        <button
          className="image-viewer__button-previous action-button-previous"
          onClick={() => onShowAttachment(previous)}
        /> : ''}

      {next ?
        <button
          className="image-viewer__button-next action-button-next"
          onClick={() => onShowAttachment(next)}
        /> : ''}

      <img src={image} className="image-viewer__image" alt="uploaded afbeelding" />
    </div>
  );
};

ImageViewer.propTypes = {
  image: PropTypes.string.isRequired,
  attachments: PropTypes.array.isRequired,

  onShowAttachment: PropTypes.func.isRequired
};

export default ImageViewer;
