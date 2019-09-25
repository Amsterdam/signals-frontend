import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

import Highlight from '../../components/Highlight';
import Location from './components/Location';
import Attachments from './components/Attachments';
import ExtraProperties from './components/ExtraProperties';

class Detail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { incident, attachments, stadsdeelList, onShowLocation, onEditLocation, onShowAttachment } = this.props;

    return (
      <article className="detail">
        <div className="detail__text" data-testid="detail-title">
          {incident.text}
        </div>

        <dl>
          <dt className="detail__definition">Overlast</dt>
          <dd className="detail__value">{string2date(incident.incident_date_start)} {string2time(incident.incident_date_start)}&nbsp;</dd>

          <Highlight
            subscribeTo={incident.location}
          >
            <Location
              incident={incident}
              stadsdeelList={stadsdeelList}
              onShowLocation={onShowLocation}
              onEditLocation={onEditLocation}
            />
          </Highlight>

          <Attachments
            attachments={attachments}
            onShowAttachment={onShowAttachment}
          />

          {incident.extra_properties ? <ExtraProperties items={incident.extra_properties} /> : ''}

          <dt className="detail__definition" data-testid="detail-email-definition">E-mail melder</dt>
          <dd className="detail__value" data-testid="detail-email-value">{incident.reporter.email}</dd>

          <dt className="detail__definition" data-testid="detail-phone-definition">Telefoon melder</dt>
          <dd className="detail__value" data-testid="detail-phone-value">{incident.reporter.phone}</dd>
        </dl>
      </article>
    );
  }
}

Detail.propTypes = {
  incident: PropTypes.object.isRequired,
  attachments: PropTypes.array.isRequired,
  stadsdeelList: PropTypes.array.isRequired,

  onShowAttachment: PropTypes.func.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default Detail;
