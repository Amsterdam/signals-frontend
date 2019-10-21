import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Heading, themeColor } from '@datapunt/asc-ui';
import styled from '@datapunt/asc-core';
import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';

const StyledWrapper = styled.aside`
  dt {
    color: ${themeColor('tint', 'level5')};
    margin-bottom: 5px;
  }

  dd {
    margin-bottom: 16px;
  }
`;

const StyledH4 = styled(Heading).attrs({
  $as: 'h4',
})`
 font-weight: normal;
 margin-bottom: 8px;
`;

const SplitDetail = ({ incident, stadsdeelList }) => (
  <StyledWrapper>
    {incident ?
    (
      <Fragment>
        <StyledH4 data-testid="splitDetailTitle">Melding {incident.id}</StyledH4>

        <dl>
          <dt data-testid="splitDetailTitleDate">Datum</dt>
          <dd data-testid="splitDetailValueDate">{string2date(incident.created_at)}</dd>
          <dt data-testid="splitDetailTitleTime">Tijd</dt>
          <dd data-testid="splitDetailValueTime">{string2time(incident.created_at)}</dd>
          <dt data-testid="splitDetailTitleDateOverlast">Datum overlast</dt>
          <dd data-testid="splitDetailValueDateOverlast">{string2date(incident.incident_date_start)}</dd>
          <dt data-testid="splitDetailTitleTimeOverlast">Tijd overlast</dt>
          <dd data-testid="splitDetailValueTimeOverlast">{string2time(incident.incident_date_start)}</dd>
          <dt data-testid="splitDetailTitleStadsdeel">Stadsdeel</dt>
          <dd data-testid="splitDetailValueStadsdeel">{getListValueByKey(stadsdeelList, incident.location.stadsdeel)}</dd>
          <dt data-testid="splitDetailTitleAddress">Adres</dt>
          <dd data-testid="splitDetailValueAddress">{incident.location.address_text}</dd>
          {incident.reporter.email ? <dt data-testid="splitDetailTitleEmail">E-mailadres</dt> : null}
          {incident.reporter.email ? <dd data-testid="splitDetailValueEmail">{incident.reporter.email}</dd> : null}
          {incident.reporter.phone ? <dt data-testid="splitDetailTitlePhone">Telefonnummer</dt> : null}
          {incident.reporter.phone ? <dd data-testid="splitDetailValuePhone">{incident.reporter.phone}</dd> : null}
          <dt data-testid="splitDetailTitleSource">Bron</dt>
          <dd data-testid="splitDetailValueSource">{incident.source}</dd>
          {incident.category.departments ? <dt data-testid="splitDetailTitleDepartment">Verantwoordelijke afdeling</dt> : null}
          {incident.category.departments ? <dd data-testid="splitDetailValueDepartment">{incident.category.departments}</dd> : null}
        </dl>
      </Fragment>
    )
      : null}
  </StyledWrapper>
);


SplitDetail.propTypes = {
  stadsdeelList: PropTypes.array,
  incident: PropTypes.object
};

export default SplitDetail;
