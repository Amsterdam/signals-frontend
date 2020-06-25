/**
 *
 * IncidentNavigation
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';

import PreviousButton from 'components/PreviousButton';
import NextButton from 'components/NextButton';
import './style.scss';

const IncidentNavigation = ({ controls, meta: { wizard, submitting, handleSubmit } }) => {
  const hideSubmit = controls?.hide_navigation_buttons?.meta ? controls.hide_navigation_buttons.meta.isVisible : false;

  return (
    <WithWizard
      render={({ next, previous, step }) => {
        const currentStep = (step && step.id && step.id.split('/').pop()) || 0;
        const wizardStep = currentStep && wizard[currentStep];

        return (
          wizardStep && (
            <div className="incident-navigation">
              {!hideSubmit && wizardStep.previousButtonLabel ? (
                <PreviousButton
                  className={wizardStep.previousButtonClass}
                  onClick={previous}
                  data-testid="previousButton"
                >
                  {wizardStep.previousButtonLabel}
                </PreviousButton>
              ) : (
                <span />
              )}

              {!hideSubmit && wizardStep.nextButtonLabel && (
                <NextButton onClick={e => handleSubmit(e, next, wizardStep.formAction)} data-testid="nextButton">
                  <span className="value">{wizardStep.nextButtonLabel}</span>
                  {submitting && (
                    <span className="working">
                      <div className="progress-indicator progress-white"></div>
                    </span>
                  )}
                </NextButton>
              )}
            </div>
          )
        );
      }}
    />
  );
};

IncidentNavigation.defaultProps = {
  meta: {},
};

IncidentNavigation.propTypes = {
  controls: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    wizard: PropTypes.object,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
  }),
};

export default IncidentNavigation;
