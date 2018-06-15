/**
*
* IncidentStep
*
*/

import React from 'react';
import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import IncidentForm from '../IncidentForm';
import IncidentPreview from '../IncidentPreview';
import './style.scss';

function IncidentStep({ content, getClassification, setIncident, incident }) {
  return (
    <div className="incident-step">
      {content.preview ?
        <IncidentPreview
          incident={incident}
          preview={content.preview}
        />
        : ''}

      {content.form ?
        <IncidentForm
          fieldConfig={content.form}
          incident={incident}
          getClassification={getClassification}
          setIncident={setIncident}
        />
        : ''}
    </div>
  );
}

IncidentStep.propTypes = {
  incident: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  setIncident: PropTypes.func.isRequired,
  content: PropTypes.object.isRequired
};

export default IncidentStep;
