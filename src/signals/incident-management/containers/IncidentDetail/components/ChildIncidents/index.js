import React, { Fragment, useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing, Heading } from '@amsterdam/asc-ui';
import Button from 'components/Button';

import { childIncidentType } from 'shared/types';
import ChildIncidentsList from 'components/ChildIncidents';
import { INCIDENT_URL } from 'signals/incident-management/routes';

import IncidentDetailContext from '../../context';
import { PATCH_TYPE_NOTES } from '../../constants';

const isChildChanged = (childDatetime, parentDatetime) => new Date(childDatetime) > new Date(parentDatetime);

const NoActionButton = styled(Button)`
  margin: ${themeSpacing(0, 2, 6, 0)};
`;

const Title = styled(Heading)`
  font-weight: 400;
  margin: ${themeSpacing(4)} 0;
`;

const ChildIncidents = ({ incidents, parent }) => {
  const { update } = useContext(IncidentDetailContext);

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

  const canReset = useMemo(() => children.some(({ changed }) => changed), [children]);
  const resetAction = useCallback(() => {
    update({
      type: PATCH_TYPE_NOTES,
      patch: {
        notes: [{ text: 'Geen actie nodig' }],
      },
    });
  }, [update]);

  if (!children?.length) {
    return null;
  }

  return (
    <Fragment>
      <Title data-testid="detail-title" forwardedAs="h2" styleAs="h4">
        Deelmelding
      </Title>

      <ChildIncidentsList incidents={children} />

      <section>
        {canReset &&
          <NoActionButton
            data-testid="noActionButton"
            variant="application"
            type="button"
            onClick={() => resetAction()}
          >
            Geen actie nodig
          </NoActionButton>
        }
      </section>

    </Fragment>
  );
};

ChildIncidents.propTypes = {
  incidents: PropTypes.arrayOf(childIncidentType).isRequired,
  parent: PropTypes.shape({ updated_at: PropTypes.string }).isRequired,
};

export default ChildIncidents;
