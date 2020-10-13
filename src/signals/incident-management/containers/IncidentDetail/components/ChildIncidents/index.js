import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing, Heading } from '@datapunt/asc-ui';

import { childIncidentType } from 'shared/types';
import ChildIncidentsList from 'components/ChildIncidents';
import { INCIDENT_URL } from 'signals/incident-management/routes';

const isChildChanged = (childDatetime, parentDatetime) => new Date(childDatetime) > new Date(parentDatetime);

const Title = styled(Heading)`
  font-weight: 400;
  margin: ${themeSpacing(4)} 0;
`;

const ChildIncidents = ({ incidents, parent }) => {
  const children = useMemo(
    () =>
      Object.values(incidents).map(({ status, category, id, updated_at }) => ({
        href: `${INCIDENT_URL}/${id}`,
        values: {
          id,
          status: status.state_display,
          category: `${category.sub} (${category.departments})`,
        },
        changed: isChildChanged(updated_at, parent.updated_at),
      })),
    [incidents, parent.updated_at]
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
  incidents: PropTypes.arrayOf(childIncidentType).isRequired,
  parent: PropTypes.shape({ updated_at: PropTypes.string }).isRequired,
};

export default ChildIncidents;
