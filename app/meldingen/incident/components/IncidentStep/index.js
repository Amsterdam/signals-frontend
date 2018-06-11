/**
*
* IncidentStep
*
*/

import React from 'react';
import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import './style.scss';

function IncidentStep({ content }) {
  const keys = Object.keys(content.preview || {});
  return (
    <div className="incident-step">
      <div>formulier met:</div>
      {content.form && content.form.map((item) => <div key={`form-${item.name}`}> - {item.name}</div>)}

      <div>preview met:</div>
      {content.preview && content.preview.lenght >= 0 ?
        content.preview.map((item) => <div key={`preview-${item.name}`}> - {item.name}</div>)
        :
        Object.values(content.preview || {}).map((item, index) => item.map((sub) => <div key={`preview-${sub.name}`}> - {keys[index]} {sub.name}</div>))
      }

    </div>
  );
}

IncidentStep.propTypes = {
  content: PropTypes.object
};

export default IncidentStep;
