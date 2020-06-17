import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { themeColor, themeSpacing, Heading, styles } from '@datapunt/asc-ui';

import BackLink from 'components/BackLink';
import { PATCH_TYPE_THOR } from 'models/incident/constants';
import Button from 'components/Button';
import { MAP_URL, INCIDENT_URL, INCIDENTS_URL } from 'signals/incident-management/routes';
import { linksType } from 'shared/types';
import { patchIncident as patchIncidentAction } from 'models/incident/actions';

import DownloadButton from './components/DownloadButton';

const Header = styled.header`
  display: grid;
  padding: ${themeSpacing(2, 0)};
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    column-gap: ${({ theme }) => theme.layouts.medium.gutter}px;
    grid-template-columns: 7fr 4fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    grid-template-columns: 7fr 1fr 4fr;
  }
`;

const BackLinkContainer = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
`;

const StyledBackLink = styled(BackLink)`
  margin: ${themeSpacing(4)} 0;
`;

const ButtonContainer = styled.div`
  grid-column-start: 3;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > * {
    margin-left: ${themeSpacing(2)};
  }
`;

const HeadingContainer = styled.div`
  display: flex;

  && > * {
    margin: 0;
  }

  & > ${styles.HeaderStyles} {
    font-weight: 400;
  }
`;

const StyledHeading = styled(Heading)`
  font-size: 16px;
  margin: 0;

  & > *:not(:first-child)::before {
    content: ' / ';
    white-space: pre;
  }
`;

const ButtonLink = styled(Button)`
  color: ${themeColor('tint', 'level7')};
  text-decoration: none;

  &:hover {
    background-color: ${themeColor('tint', 'level4')};
    color: ${themeColor('tint', 'level7')};
  }
`;

const ParentLink = styled(Link)`
  text-decoration: underline;
  color: black;
`;

const DetailHeader = ({ status, incidentId, links }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const canSplit = status === 'm' && !(links?.['sia:children'] || links?.['sia:parent']);
  const canThor = ['m', 'i', 'b', 'h', 'send failed', 'reopened'].some(value => value === status);
  const downloadLink = links?.['sia:pdf']?.href;
  const patch = {
    id: incidentId,
    type: PATCH_TYPE_THOR,
    patch: {
      status: {
        state: 'ready to send',
        text: 'Te verzenden naar THOR',
        target_api: 'sigmax',
      },
    },
  };

  const referrer = location.referrer?.startsWith(MAP_URL) ? MAP_URL : INCIDENTS_URL;
  const parentId = links?.['sia:parent']?.href?.split('/').pop();

  const patchIncident = useCallback(() => {
    dispatch(patchIncidentAction(patch));
  }, [dispatch, patch]);

  return (
    <Header className="detail-header">
      <BackLinkContainer>
        <StyledBackLink to={referrer}>Terug naar overzicht</StyledBackLink>
      </BackLinkContainer>

      <HeadingContainer>
        <StyledHeading data-testid="detail-header-title">
          Melding&nbsp;
          {parentId && (
            <ParentLink data-testid="parentLink" to={`${INCIDENT_URL}/${parentId}`}>
              {parentId}
            </ParentLink>
          )}
          <span>{incidentId}</span>
        </StyledHeading>
      </HeadingContainer>

      <ButtonContainer>
        {canSplit && (
          <ButtonLink
            variant="application"
            forwardedAs={Link}
            to={`${INCIDENT_URL}/${incidentId}/split`}
            data-testid="detail-header-button-split"
          >
            Splitsen
          </ButtonLink>
        )}

        {canThor && (
          <Button variant="application" onClick={patchIncident} data-testid="detail-header-button-thor">
            THOR
          </Button>
        )}

        <DownloadButton
          label="PDF"
          url={downloadLink}
          filename={`SIA melding ${incidentId}.pdf`}
          data-testid="detail-header-button-download"
        />
      </ButtonContainer>
    </Header>
  );
};

DetailHeader.propTypes = {
  incidentId: PropTypes.number.isRequired,
  links: linksType,
  status: PropTypes.string.isRequired,
};

export default DetailHeader;
