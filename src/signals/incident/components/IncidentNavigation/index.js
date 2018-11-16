/**
*
* IncidentNavigation
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';

import './style.scss';

const IncidentNavigation = ({ valid, controls, value, meta: { incidentContainer, wizard, isAuthenticated, updateIncident, createIncident, handleSubmit } }) => {
  const showSubmit = controls.navigation_submit_button && controls.navigation_submit_button.meta && controls.navigation_submit_button.meta ? controls.navigation_submit_button.meta.isVisible : true;
  return (
    <span>
      <WithWizard
        render={({ next, previous, step }) => {
          const wizardStep = wizard[step.id.split('/').pop()];
          return (
            <div className="incident-navigation">
              {showSubmit && wizardStep.previousButtonLabel ? (
                <button
                  className={`incident-navigation__button  ${wizardStep.previousButtonClass}`}
                  onClick={previous}
                >
                  {wizardStep.previousButtonLabel}
                </button>
              ) : <span /> }

              {showSubmit && wizardStep.nextButtonLabel && (
                <button
                  className={`incident-navigation__button  ${wizardStep.nextButtonClass}`}
                  onClick={(e) => {
                    if (valid) {
                      switch (wizardStep.formAction) { // eslint-disable-line default-case
                        case 'UPDATE_INCIDENT':
                          updateIncident(value);
                          break;

                        case 'CREATE_INCIDENT':
                          createIncident({
                            incident: incidentContainer.incident,
                            wizard,
                            isAuthenticated
                          });
                      }

                      handleSubmit(e);
                      next();
                    }
                  }}
                >
                  {wizardStep.nextButtonLabel}
                </button>
              )}
            </div>
          );
        }}
      />
    </span>
  );
};

IncidentNavigation.defaultProps = {
  meta: {}
};

IncidentNavigation.propTypes = {
  valid: PropTypes.bool.isRequired,
  controls: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    wizard: PropTypes.object,
    handleSubmit: PropTypes.function
  })
};

export default IncidentNavigation;
