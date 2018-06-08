/**
*
* IncidentStep
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';

function IncidentStep({ content }) {
  console.log('content', content);
  return (
    <div className="incident-step">
      <FormattedMessage {...messages.header} />
    </div>
  );
}

IncidentStep.propTypes = {
  content: PropTypes.object
};

export default IncidentStep;
