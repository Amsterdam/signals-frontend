import React from 'react';
import PropTypes from 'prop-types';

import { attachmentsType } from 'shared/types';

import './style.scss';

const AttachmentViewer = ({ href, attachments, onShowAttachment }) => {
  const index = attachments.findIndex((item) => item.location === href);
  const previous = index > 0 ? attachments[index - 1].location : false;
  const next = index < (attachments.length - 1) ? attachments[index + 1].location : false;

  return (
    <div className="attachment-viewer">
      {previous ?
        <button
          className="attachment-viewer__button-previous incident-detail__button--previous"
          data-testid="attachment-viewer-button-previous"
          onClick={() => onShowAttachment(previous)}
        /> : ''}

      {next ?
        <button
          className="attachment-viewer__button-next incident-detail__button--next"
          data-testid="attachment-viewer-button-next"
          onClick={() => onShowAttachment(next)}
        /> : ''}

      <img src={href} data-testid="attachment-viewer-image" className="attachment-viewer__image" alt="uploaded afbeelding" />
    </div>
  );
};

AttachmentViewer.propTypes = {
  href: PropTypes.string.isRequired,
  attachments: attachmentsType.isRequired,

  onShowAttachment: PropTypes.func.isRequired
};

export default AttachmentViewer;
