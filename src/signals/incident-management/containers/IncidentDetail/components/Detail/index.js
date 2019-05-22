import React from 'react';
import PropTypes from 'prop-types';
// import { isEqual } from 'lodash';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

import Attachments from './components/Attachments';
import Location from './components/Location';

class Detail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  // constructor(props) {
    // super(props);

    // this.state = {
      // location: props.incident.location,
      // locationUpdated: props.locationUpdated
    // };

    // this.clearHighlight = this.clearHighlight.bind(this);
    // this.locationTimer = null;
  // }

  // static getDerivedStateFromProps(props, state) {
    // const locationChanged = isEqual(props.incident.location, state.location);
    // return {
      // location: !locationChanged ? props.incident.location : state.location,
      // locationUpdated: !locationChanged
    // };
  // }

  // componentDidUpdate = () => {
    // if (this.state.locationUpdated) {
      // this.locationTimer = global.window.setTimeout(() => {
        // this.clearHighlight('locationUpdated');
      // }, HIGHLIGHT_TIMEOUT_INTERVAL);
    // }
  // }

  // componentWillUnmount() {
    // if (this.locationTimer) {
      // global.window.clearTimeout(this.locationTimer);
    // }
  // }

  // clearHighlight(highlight) {
    // this.setState({
      // [highlight]: false
    // });
  // }

  render() {
    const { incident, attachments, stadsdeelList, onShowLocation, onEditLocation, onShowAttachment } = this.props;
    // const { locationUpdated } = this.state;

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

Detail.defaultProps = {
  location: {},
  locationUpdated: false,
  locationTimer: null
};

Detail.propTypes = {
  incident: PropTypes.object.isRequired,
  attachments: PropTypes.array.isRequired,
  // location: PropTypes.object,
  // locationUpdated: PropTypes.bool,
  stadsdeelList: PropTypes.array.isRequired,

  onShowAttachment: PropTypes.func.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired
};

export default Detail;
