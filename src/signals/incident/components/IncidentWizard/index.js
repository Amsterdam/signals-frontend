import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';
import { Heading, themeSpacing } from '@datapunt/asc-ui';
import styled from 'styled-components';

import LoadingIndicator from 'components/LoadingIndicator';

import AppContext from 'containers/App/context';
import IncidentForm from '../IncidentForm';
import IncidentPreview from '../IncidentPreview';
import onNext from './services/on-next';

const StyledH1 = styled(Heading)`
  margin-top: ${themeSpacing(6)};
  margin-bottom: ${themeSpacing(5)};
`;

const IncidentWizard = ({ wizardDefinition, getClassification, updateIncident, createIncident, incidentContainer }) => {
  const appContext = useContext(AppContext);
  const incident = useMemo(() => incidentContainer.incident, [incidentContainer.incident]);

  return (
    <div className="incident-wizard">
      <Route
        render={({ history }) => (
          <Wizard history={history} onNext={wiz => onNext(wizardDefinition, wiz, incident)}>
            {incidentContainer.loading || appContext.loading ? (
              <LoadingIndicator />
            ) : (
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
                        <article>
                          <header>
                            <StyledH1>{label || key}</StyledH1>
                          </header>

                          {preview && incident && <IncidentPreview incident={incident} preview={preview} />}

                          {(form || formFactory) && (
                            <IncidentForm
                              fieldConfig={form || formFactory(incident, appContext)}
                              incidentContainer={incidentContainer}
                              getClassification={getClassification}
                              updateIncident={updateIncident}
                              createIncident={createIncident}
                              wizard={wizardDefinition}
                              postponeSubmitWhenLoading={postponeSubmitWhenLoading}
                            />
                          )}
                        </article>
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
};

IncidentWizard.propTypes = {
  incidentContainer: PropTypes.object.isRequired,
  wizardDefinition: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
};

export default IncidentWizard;
