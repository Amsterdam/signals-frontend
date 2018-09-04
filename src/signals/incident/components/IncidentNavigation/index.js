/**
*
* IncidentNavigation
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import './style.scss';

const IncidentNavigation = ({ valid, meta: { form, incidentContainer, wizard, handleSubmit, setIncident, createIncident } }) => (
  <span>
    <WithWizard
      render={({ next, previous, step, steps }) => (
        <div className="incident-navigation">
          {steps.indexOf(step) > 0 && (
            <button className="incident-navigation__button action startagain" onClick={previous}>
              Vorige
            </button>
          )}

          {steps.indexOf(step) < steps.length - 1 && (
            <button
              className={`incident-navigation__button action primary ${step.id === 'incident/samenvatting' ? '' : 'arrow-right'}`}
              onClick={(e) => {
                if (valid) {
                  handleSubmit(e);
                  if (step.id === 'incident/samenvatting') {
                    createIncident({ incident: incidentContainer.incident, wizard });
                  } else {
                    setIncident(form.value);
                  }
                  next();
                }
              }}
            >
              {step.id === 'incident/samenvatting' ?
                'Verstuur'
              :
                'Volgende'
              }
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
    form: PropTypes.object,
    incidentContainer: PropTypes.object,
    handleSubmit: PropTypes.function,
    setIncident: PropTypes.function,
    createIncident: PropTypes.function
  })
};

export default IncidentNavigation;
