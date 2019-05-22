import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

import Attachments from './components/Attachments';
import Location from './components/Location';

class Detail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { incident, attachments, stadsdeelList, onShowLocation, onEditLocation, onShowAttachment } = this.props;

    return (
      <article className="detail">
        <div className="detail__text">
          {incident.text}
        </div>

        <dl>
          <dt className="detail__definition">Overlast</dt>
          <dd className="detail__value">{string2date(incident.incident_date_start)} {string2time(incident.incident_date_start)}&nbsp;</dd>

          <Location
            incident={incident}
            stadsdeelList={stadsdeelList}
            onShowLocation={onShowLocation}
            onEditLocation={onEditLocation}
          />

          <Attachments
            attachments={attachments}
            onShowAttachment={onShowAttachment}
          />

          {incident.extra_properties && Object.keys(incident.extra_properties).map((key) =>
           (<dl key={key}><dt className="detail__definition">{key}</dt><dd className="detail__value">{incident.extra_properties[key]}&nbsp;</dd></dl>)
          )}

          <dt className="detail__definition">Email</dt>
          <dd className="detail__value">{incident.reporter.email}</dd>

          <dt className="detail__definition">Telefoonnummer</dt>
          <dd className="detail__value">{incident.reporter.phone}</dd>
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
  onEditLocation: PropTypes.func.isRequired
};

export default Detail;
