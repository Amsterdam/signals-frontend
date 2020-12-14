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
import { useSelector } from 'react-redux';
import { makeSelectHandlingTimesBySlug } from 'models/categories/selectors';

const isChildChanged = (childDatetime, parentDatetime) => new Date(childDatetime) > new Date(parentDatetime);

const Section = styled.section`
  margin: ${themeSpacing(0, 2, 6, 0)};
`;

const Title = styled(Heading)`
  font-weight: 400;
  margin: ${themeSpacing(4)} 0;
`;

const ChildIncidents = ({ incidents, parent }) => {
  const { update } = useContext(IncidentDetailContext);
  const handlingTimesBySlug = useSelector(makeSelectHandlingTimesBySlug);

  const children = useMemo(
    () =>
      Object.values(incidents).map(({ status, category, id, updated_at }) => ({
        href: `${INCIDENT_URL}/${id}`,
        values: {
          id,
          status: status.state_display,
          category: `${category.sub} (${category.departments})`,
          handlingTime: handlingTimesBySlug[category.sub_slug],
        },
        changed: isChildChanged(updated_at, parent.updated_at),
      })),
    [handlingTimesBySlug, incidents, parent.updated_at]
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
      <Title data-testid="detail-title" forwardedAs="h2" styleAs="h4">Deelmelding</Title>

      <ChildIncidentsList incidents={children} />

      <Section>
        {canReset && (
          <Button type="button" variant="application" data-testid="noActionButton" onClick={() => resetAction()}>
            Geen actie nodig
          </Button>
        )}
      </Section>
    </Fragment>
  );
};

ChildIncidents.propTypes = {
  incidents: PropTypes.arrayOf(childIncidentType).isRequired,
  parent: PropTypes.shape({ updated_at: PropTypes.string }).isRequired,
};

export default ChildIncidents;
