// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { WithWizard } from 'react-albus';
import { themeSpacing, themeColor } from '@amsterdam/asc-ui';

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

const IncidentNavigation = ({ meta: { wizard, handleSubmit } }) => (
  <WithWizard
    render={({ next, previous, step }) => {
      const currentStep = step?.id?.split('/').pop();
      const wizardStep = currentStep !== 'bedankt' && wizard[currentStep];

      if (!wizardStep) return null;

      return (
        wizardStep && (
          <Nav className="incident-navigation">
            {wizardStep.previousButtonLabel ? (
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

            {wizardStep.nextButtonLabel && (
              <NextButton onClick={e => handleSubmit(e, next, wizardStep.formAction)} data-testid="nextButton">
                <span className="value">{wizardStep.nextButtonLabel}</span>
              </NextButton>
            )}
          </Nav>
        )
      );
    }}
  />
);

IncidentNavigation.defaultProps = {
  meta: {},
};

IncidentNavigation.propTypes = {
  meta: PropTypes.shape({
    wizard: PropTypes.shape({}),
    handleSubmit: PropTypes.func.isRequired,
  }),
};

export default IncidentNavigation;
