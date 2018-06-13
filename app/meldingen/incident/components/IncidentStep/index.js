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
import './style.scss';

function IncidentStep({ content, setIncident, incident }) {
  const keys = Object.keys(content.preview || {});
  return (
    <div className="incident-step">
      {content.preview && content.preview.lenght >= 0 ?
        content.preview.map((item) => <div key={`preview-${item.name}`}> - {item.name}</div>)
        :
        Object.values(content.preview || {}).map((item, index) => item.map((sub) => <div key={`preview-${sub.name}`}> - {keys[index]} {sub.name}</div>))
      }

      {content.form ?
        <IncidentForm
          fieldConfig={content.form}
          setIncident={setIncident}
          incident={incident}
        />
        :
        ''
      }
    </div>
  );
}

IncidentStep.propTypes = {
  incident: PropTypes.object.isRequired,
  setIncident: PropTypes.func.isRequired,
  content: PropTypes.object.isRequired
};

export default IncidentStep;
