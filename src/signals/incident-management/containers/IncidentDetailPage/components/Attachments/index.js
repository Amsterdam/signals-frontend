import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const Attachments = ({ incident, onShowAttachment }) => (
  <dl className="attachments">
    {incident.image ?
      <dl>
        <dt className="attachments__definition">Foto</dt>
        <dd className="attachments__value">
          <button className="attachments__image-button" onClick={() => onShowAttachment(incident.image)} style={{ backgroundImage: `url(${incident.image})` }} />
        </dd>
      </dl>
    : ''}

  </dl>
);

Attachments.propTypes = {
  incident: PropTypes.object.isRequired,
  onShowAttachment: PropTypes.func.isRequired
};

export default Attachments;
