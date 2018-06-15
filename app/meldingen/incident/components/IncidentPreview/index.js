/**
*
* IncidentPreview
*
*/

import React from 'react';
import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
//      <FormattedMessage {...messages.header} />

import './style.scss';

function IncidentPreview({ incident, preview }) {
  return (
    <div className="incident-preview">
      {Object.keys(preview).map((key) => (
        <ul key={key}>
          {Object.keys(preview[key]).map((subkey) => (
            <li key={subkey}>{preview[key][subkey].label} <span className="preview-item-value">{incident[subkey]}</span></li>
          ))}
        </ul>
      ))}
    </div>
  );
}

IncidentPreview.propTypes = {
  incident: PropTypes.object,
  preview: PropTypes.object
};

export default IncidentPreview;
