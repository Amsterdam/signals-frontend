import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

import Attachments from './components/Attachments';
import Location from './components/Location';

export const HIGHLIGHT_TIMEOUT_INTERVAL = 2200;

class IncidentDetail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      location: props.incident.location,
      locationUpdated: props.locationUpdated
    };

    this.clearHighlight = this.clearHighlight.bind(this);
    this.locationTimer = null;
  }

  static getDerivedStateFromProps(props, state) {
    const locationChanged = isEqual(props.incident.location, state.location);
    return {
      location: !locationChanged ? props.incident.location : state.location,
      locationUpdated: !locationChanged
    };
  }

  componentDidUpdate = () => {
    if (this.state.locationUpdated) {
      this.locationTimer = global.window.setTimeout(() => {
        this.clearHighlight('locationUpdated');
      }, HIGHLIGHT_TIMEOUT_INTERVAL);
    }
  }

  componentWillUnmount() {
    if (this.locationTimer) {
      global.window.clearTimeout(this.locationTimer);
    }
  }

  clearHighlight(highlight) {
    this.setState({
      [highlight]: false
    });
  }

  render() {
    const { incident, attachments, stadsdeelList, onShowLocation, onEditLocation, onShowAttachment } = this.props;
    const { locationUpdated } = this.state;

    return (
      <article className="incident-detail">
        <div className="incident-detail__text">
          {incident.text}
        </div>

        <dl>
          <dt className="incident-detail__definition">Overlast</dt>
          <dd className="incident-detail__value">{string2date(incident.incident_date_start)} {string2time(incident.incident_date_start)}&nbsp;</dd>

          <Location
            incident={incident}
            stadsdeelList={stadsdeelList}
            locationUpdated={locationUpdated}
            onShowLocation={onShowLocation}
            onEditLocation={onEditLocation}
          />

          <Attachments
            attachments={attachments}
            onShowAttachment={onShowAttachment}
          />

          {incident.extra_properties && Object.keys(incident.extra_properties).map((key) =>
           (<dl key={key}><dt className="incident-detail__definition">{key}</dt><dd className="incident-detail__value">{incident.extra_properties[key]}&nbsp;</dd></dl>)
          )}

          <dt className="incident-detail__definition">Email</dt>
          <dd className="incident-detail__value">{incident.reporter.email}</dd>

          <dt className="incident-detail__definition">Telefoonnummer</dt>
          <dd className="incident-detail__value">{incident.reporter.phone}</dd>
        </dl>
      </article>
    );
  }
}

IncidentDetail.defaultProps = {
  location: {},
  locationUpdated: false,
  locationTimer: null
};

IncidentDetail.propTypes = {
  incident: PropTypes.object.isRequired,
  attachments: PropTypes.array.isRequired,
  location: PropTypes.object,
  locationUpdated: PropTypes.bool,
  stadsdeelList: PropTypes.array.isRequired,

  onShowAttachment: PropTypes.func.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired
};

export default IncidentDetail;
