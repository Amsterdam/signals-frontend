import React, { Fragment, useMemo } from 'react';
import styled from 'styled-components';
import { themeSpacing, Heading } from '@datapunt/asc-ui';

import { incidentType } from 'shared/types';
import ChildIncidentsList from 'components/ChildIncidents';
import { INCIDENT_URL } from 'signals/incident-management/routes';

const Title = styled(Heading)`
  font-weight: 400;
  margin: ${themeSpacing(4)} 0;
`;

const ChildIncidents = ({ incident }) => {
  const incidentLinks = incident?._links;
  const children = useMemo(
    () =>
      incidentLinks?.['sia:children']?.map(({ href }) => {
        const id = href.substring(href.lastIndexOf('/') + 1, href.length);

        return {
          href: `${INCIDENT_URL}/${id}`,
          values: {
            id,
          },
        };
      }),
    [incidentLinks]
  );

  if (!children?.length) {
    return null;
  }

  return (
    <Fragment>
      <Title data-testid="detail-title" forwardedAs="h2" styleAs="h4">
        Deelmelding
      </Title>

      <ChildIncidentsList incidents={children} />
    </Fragment>
  );
};

ChildIncidents.propTypes = {
  incident: incidentType.isRequired,
};

export default ChildIncidents;
