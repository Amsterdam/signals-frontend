import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Heading } from '@datapunt/asc-ui';
import styled from '@datapunt/asc-core';
import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';

const StyledWrapper = styled.aside`
  dt {
    color: #787878;
    margin-bottom: 5px;
  }

  dd {
    font-family: 'Avenir Next LT W01 Demi', arial, sans-serif;
    margin-bottom: 16px;
  }
`;

const StyledH4 = styled(Heading)`
  font-weight: normal;
  margin-bottom: 8px;
`;

const SplitDetail = ({ incident, stadsdeelList }) => (
  <StyledWrapper>
    {incident ?
    (
      <Fragment>
        <StyledH4 $as="h4">Melding {incident.id}</StyledH4>

        <dl>
          <dt>Datum</dt>
          <dd>{string2date(incident.created_at)}</dd>
          <dt>Tijd</dt>
          <dd>{string2time(incident.created_at)}</dd>
          <dt>Datum overlast</dt>
          <dd>{string2date(incident.incident_date_start)}</dd>
          <dt>Tijd overlast</dt>
          <dd>{string2time(incident.incident_date_start)}</dd>
          <dt>Stadsdeel</dt>
          <dd>{getListValueByKey(stadsdeelList, incident.location.stadsdeel)}</dd>
          <dt>Adres</dt>
          <dd>{incident.location.address_text}</dd>
          {incident.reporter.email ? <dt>E-mailadres</dt> : ''}
          {incident.reporter.email ? <dd>{incident.reporter.email}</dd> : ''}
          {incident.reporter.phone ? <dt>Telefonnummer</dt> : ''}
          {incident.reporter.phone ? <dd>{incident.reporter.phone}</dd> : ''}
          <dt>Bron</dt>
          <dd>{incident.source}</dd>
          {incident.category.department ? <dt>Verantwoordelijke afdeling</dt> : ''}
          {incident.category.department ? <dd>{incident.category.department}</dd> : ''}
        </dl>
      </Fragment>
    )
      : ''}
  </StyledWrapper>
);


SplitDetail.propTypes = {
  stadsdeelList: PropTypes.array,
  incident: PropTypes.object
};

export default SplitDetail;
