/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const SplitForm = ({ incident, handleSubmit, handleCancel }) => {
  return (
    <div className="split-form">
      {incident ? (
        <div>
          <h1>Splitsen</h1>
          <h2>Deelmelding 1</h2>

          <button onClick={handleSubmit} className="action primary">Splitsen</button>
          <button onClick={handleCancel} className="action tertiair">Annuleer</button>
        </div>
      )
    : ''}
    </div>
  );
};

SplitForm.propTypes = {
  incident: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default SplitForm;
