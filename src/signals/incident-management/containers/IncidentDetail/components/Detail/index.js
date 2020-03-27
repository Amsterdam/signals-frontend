import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { incidentType, attachmentsType } from 'shared/types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

import Location from './components/Location';
import Attachments from './components/Attachments';
import ExtraProperties from './components/ExtraProperties';

const Detail = ({ incident, attachments, onShowLocation, onEditLocation, onShowAttachment }) => (
  <article className="detail">
    <div className="detail__text" data-testid="detail-title">
      {incident.text}
    </div>

    <dl>
      <dt className="detail__definition">Overlast</dt>
      <dd className="detail__value">
        {string2date(incident.incident_date_start)} {string2time(incident.incident_date_start)}&nbsp;
      </dd>

      <Location incident={incident} onShowLocation={onShowLocation} onEditLocation={onEditLocation} />

      <Attachments attachments={attachments} onShowAttachment={onShowAttachment} />

      {incident.extra_properties && <ExtraProperties items={incident.extra_properties} />}

      <dt className="detail__definition" data-testid="detail-email-definition">
        E-mail melder
      </dt>
      <dd className="detail__value" data-testid="detail-email-value">
        {incident.reporter.email}
      </dd>

      <dt className="detail__definition" data-testid="detail-phone-definition">
        Telefoon melder
      </dt>
      <dd className="detail__value" data-testid="detail-phone-value">
        {incident.reporter.phone}
      </dd>
    </dl>
  </article>
);

Detail.propTypes = {
  incident: incidentType.isRequired,
  attachments: attachmentsType,

  onShowAttachment: PropTypes.func.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default memo(Detail);
