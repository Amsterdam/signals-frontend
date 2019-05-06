import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const ImageViewer = ({ attachment, attachments, onShowAttachment }) => {
  const index = attachments.findIndex((item) => item.location === attachment);
  const previous = index > 0 ? attachments[index - 1].location : false;
  const next = index < (attachments.length - 1) ? attachments[index + 1].location : false;

  return (
    <div className="attachment-viewer">
      {previous ?
        <button
          className="attachment-viewer__button-previous detail__button--previous"
          onClick={() => onShowAttachment(previous)}
        /> : ''}

      {next ?
        <button
          className="attachment-viewer__button-next detail__button--next"
          onClick={() => onShowAttachment(next)}
        /> : ''}

      <img src={attachment} className="attachment-viewer__attachment" alt="uploaded afbeelding" />
    </div>
  );
};

ImageViewer.propTypes = {
  attachment: PropTypes.string.isRequired,
  attachments: PropTypes.array.isRequired,

  onShowAttachment: PropTypes.func.isRequired
};

export default ImageViewer;
