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

const IncidentNavigation = ({ valid, meta: { form, handleSubmit, setIncident } }) => (
  <span>
    <WithWizard
      render={({ next, previous, step, steps }) => (
        <div className="incident-navigation">
          {steps.indexOf(step) > 0 && (
            <button className="incident-navigation__button action startagain" onClick={previous}>
              <FormattedMessage {...messages.previous} />
            </button>
          )}

          {steps.indexOf(step) < steps.length - 1 && (
            <button
              className="incident-navigation__button action primary arrow-right"
              onClick={(e) => {
                if (valid) {
                  handleSubmit(e);
                  setIncident(form.value);
                  next();
                }
              }}
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
  valid: PropTypes.bool.isRequired,
  meta: PropTypes.shape({
    handleSubmit: PropTypes.function
  })
};

export default IncidentNavigation;
