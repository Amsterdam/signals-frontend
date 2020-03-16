import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';
import { Heading, themeSpacing } from '@datapunt/asc-ui';
import styled from 'styled-components';

import LoadingIndicator from 'shared/components/LoadingIndicator';

import IncidentForm from '../IncidentForm';
import IncidentPreview from '../IncidentPreview';
import onNext from './services/on-next';

const StyledH1 = styled(Heading)`
  font-weight: 400;
  margin-top: ${themeSpacing(6)};
  margin-bottom: 30px;
`;

const IncidentWizard = ({ wizardDefinition, getClassification, updateIncident, createIncident, incidentContainer }) => (
  <div className="incident-wizard">
    <Route
      render={({ history }) => (
        <Wizard history={history} onNext={wiz => onNext(wizardDefinition, wiz, incidentContainer.incident)}>
          {incidentContainer.loading && <LoadingIndicator />}

          {!incidentContainer.loading && (
            <Steps>
              {Object.keys(wizardDefinition).map(key => (
                <Step
                  key={key}
                  id={`incident/${key}`}
                  render={() => {
                    const { form, formFactory, label, postponeSubmitWhenLoading, preview } = wizardDefinition[key];
                    const shouldRender = preview || form || formFactory;

                    if (!shouldRender) {
                      return null;
                    }

                    return (
                      <div>
                        <StyledH1>{label || key}</StyledH1>

                        {preview && <IncidentPreview incidentContainer={incidentContainer} preview={preview} />}

                        {(form || formFactory) && (
                          <IncidentForm
                            fieldConfig={form || formFactory(incidentContainer.incident)}
                            incidentContainer={incidentContainer}
                            getClassification={getClassification}
                            updateIncident={updateIncident}
                            createIncident={createIncident}
                            wizard={wizardDefinition}
                            postponeSubmitWhenLoading={postponeSubmitWhenLoading}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              ))}
            </Steps>
          )}
        </Wizard>
      )}
    />
  </div>
);

IncidentWizard.propTypes = {
  incidentContainer: PropTypes.object.isRequired,
  wizardDefinition: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
};

export default IncidentWizard;
