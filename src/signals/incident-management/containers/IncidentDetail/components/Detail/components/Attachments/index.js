import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const Attachments = ({ attachments, onShowAttachment }) => (
  <dl className="attachments">
    {attachments.length ?
      <dl>
        <dt className="attachments__definition">Foto</dt>
        <dd className="attachments__value">
          {attachments.map((attachment) =>
            (<button
              key={attachment.location}
              className="attachments__image-button"
              onClick={() => onShowAttachment(attachment.location)}
              style={{ backgroundImage: `url(${attachment.location})` }}
            />)
          )}

        </dd>
      </dl>
    : ''}

  </dl>
);

Attachments.propTypes = {
  attachments: PropTypes.array.isRequired,
  onShowAttachment: PropTypes.func.isRequired
};

export default Attachments;
