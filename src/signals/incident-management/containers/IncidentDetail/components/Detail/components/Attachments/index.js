import React from 'react';
import PropTypes from 'prop-types';

import { attachmentsType } from 'shared/types';

import './style.scss';

const Attachments = ({ attachments, onShowAttachment }) => (
  <dl className="attachments">
    {attachments.length
      ? (
        <dl>
          <dt className="attachments__definition" data-testid="attachments-definition">Foto</dt>
          <dd className="attachments__value" data-testid="attachments-value">
            {attachments.map(attachment => (
              <button
                key={attachment.location}
                type="button"
                data-testid="attachments-value-button"
                className="attachments__image-button"
                onClick={() => onShowAttachment(attachment.location)}
                style={{ backgroundImage: `url(${attachment.location})` }}
              />
            ))}
          </dd>
        </dl>
      )
      : ''}

  </dl>
);

Attachments.propTypes = {
  attachments: attachmentsType.isRequired,
  onShowAttachment: PropTypes.func.isRequired,
};

export default Attachments;
