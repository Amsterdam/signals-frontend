/**
*
* IncidentNavigation
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './style.scss';

const IncidentNavigation = ({ meta: { handleSubmit } }) => (
  <span>
    <WithWizard
      render={({ previous, step, steps }) => (
        <div className="incident-navigation">
          {steps.indexOf(step) > 0 && (
            <button className="incident-navigation__button" onClick={previous}>
              <FormattedMessage {...messages.previous} />
            </button>
          )}

          {steps.indexOf(step) < steps.length - 1 && (
            <button
              className="incident-navigation__button"
              onClick={handleSubmit}
            >
              <FormattedMessage {...messages.next} />
            </button>
          )}
        </div>
      )}
    />
  </span>
);

IncidentNavigation.defaultProps = {
  meta: { handleSubmit: () => {} }
};

IncidentNavigation.propTypes = {
  meta: PropTypes.shape({
    handleSubmit: PropTypes.function
  })
};

export default IncidentNavigation;
