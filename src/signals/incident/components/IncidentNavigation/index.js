import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';
import { themeSpacing, themeColor } from '@datapunt/asc-ui';

import PreviousButton from 'components/PreviousButton';
import NextButton from 'components/NextButton';

const Nav = styled.div`
  align-items: center;
  background-color: ${themeColor('tint', 'level3')};
  display: flex;
  height: ${themeSpacing(16)};
  justify-content: space-between;
  margin-top: ${themeSpacing(7)};
  padding: ${themeSpacing(0, 4)};
`;

const IncidentNavigation = ({ controls, meta: { wizard, submitting, handleSubmit } }) => {
  const hideSubmit = controls?.hide_navigation_buttons?.meta ? controls.hide_navigation_buttons.meta.isVisible : false;

  return (
    <WithWizard
      render={({ next, previous, step }) => {
        const currentStep = step?.id?.split('/').pop() || 0;
        const wizardStep = currentStep !== 'bedankt' && wizard[currentStep];

        return (
          wizardStep && (
            <Nav className="incident-navigation">
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
            </Nav>
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
