/**
 *
 * IncidentNavigation
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';

import './style.scss';

const IncidentNavigation = ({
  valid,
  controls,
  value,
  meta: { incidentContainer, wizard, isAuthenticated, updateIncident, createIncident, handleSubmit },
}) => {
  const hideSubmit =
    controls.hide_navigation_buttons && controls.hide_navigation_buttons.meta && controls.hide_navigation_buttons.meta
      ? controls.hide_navigation_buttons.meta.isVisible
      : false;
  return (
    <span>
      <WithWizard
        render={({ next, previous, step }) => {
          const currentStep = step && step.id;
          const wizardStep = currentStep && wizard[currentStep.split('/').pop()];

          return (
            <div>
              {wizardStep ? (
                <div className="incident-navigation">
                  {!hideSubmit && wizardStep.previousButtonLabel ? (
                    <button
                      className={`incident-navigation__button  ${wizardStep.previousButtonClass}`}
                      onClick={previous}
                      type="button"
                    >
                      {wizardStep.previousButtonLabel}
                    </button>
                  ) : (
                    <span />
                  )}

                  {!hideSubmit && wizardStep.nextButtonLabel && (
                    <button
                      type="submit"
                      className={`incident-navigation__button  ${wizardStep.nextButtonClass}`}
                      onClick={e => {
                        if (valid) {
                          /* eslint-disable default-case */
                          switch (
                            wizardStep.formAction
                          ) {
                            case 'UPDATE_INCIDENT':
                              updateIncident(value);
                              break;

                            case 'CREATE_INCIDENT':
                              createIncident({
                                incident: incidentContainer.incident,
                                wizard,
                                isAuthenticated,
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
              ) : (
                ''
              )}
            </div>
          );
        }}
      />
    </span>
  );
};

IncidentNavigation.defaultProps = {
  meta: {},
};

IncidentNavigation.propTypes = {
  valid: PropTypes.bool.isRequired,
  controls: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    wizard: PropTypes.object,
    handleSubmit: PropTypes.func,
    incidentContainer: PropTypes.shape({
      incident: PropTypes.shape({
        incident_date: PropTypes.string,
        incident_time_hours: PropTypes.number,
        incident_time_minutes: PropTypes.number,
        priority: PropTypes.shape({
          id: PropTypes.string,
          label: PropTypes.string,
        }),
      }).isRequired,
    }).isRequired,
    isAuthenticated: PropTypes.bool,
    updateIncident: PropTypes.func,
    createIncident: PropTypes.func,
  }),
};

export default IncidentNavigation;
