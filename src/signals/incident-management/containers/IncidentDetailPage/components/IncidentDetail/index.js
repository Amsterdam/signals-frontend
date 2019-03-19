import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { isEqual } from 'lodash';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import './style.scss';

export const HIGHLIGHT_TIMEOUT_INTERVAL = 2200;

class IncidentDetail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      location: props.incident.location,
      locationUpdated: props.locationUpdated,
      stadsdeelUpdated: props.stadsdeelUpdated
    };

    this.clearHighlight = this.clearHighlight.bind(this);
    this.locationTimer = null;
    this.stadsdeelTimer = null;
  }

  static getDerivedStateFromProps(props, state) {
    const locationChanged = isEqual(props.incident.location, state.location);
    return {
      location: !locationChanged ? props.incident.location : state.location,
      locationUpdated: !locationChanged,
      stadsdeelUpdated: !isEqual(props.incident.location.stadsdeel, state.location.stadsdeel)
    };
  }

  componentDidUpdate = () => {
    if (this.state.locationUpdated) {
      this.locationTimer = global.window.setTimeout(() => {
        this.clearHighlight('locationUpdated');
      }, HIGHLIGHT_TIMEOUT_INTERVAL);
    }
    if (this.state.stadsdeelUpdated) {
      this.stadsdeelTimer = global.window.setTimeout(() => {
        this.clearHighlight('stadsdeelUpdated');
      }, HIGHLIGHT_TIMEOUT_INTERVAL);
    }
  }

  componentWillUnmount() {
    if (this.locationTimer) {
      global.window.clearTimeout(this.locationTimer);
    }
    if (this.stadsdeelTimer) {
      global.window.clearTimeout(this.stadsdeelTimer);
    }
  }

  clearHighlight(highlight) {
    this.setState({
      [highlight]: false
    });
  }

  render() {
    const { incident, stadsdeelList, priorityList } = this.props;
    const { locationUpdated, stadsdeelUpdated } = this.state;
    const extraProperties = incident.extra_properties && Object.keys(incident.extra_properties).map((key) =>
      (<span key={key}><dt className="incident-detail__body__definition">{key}</dt><dd className="incident-detail__body__value">{incident.extra_properties[key]}&nbsp;</dd></span>)
    );

    return (
      <div className="incident-detail">
        <div className="incident-detail__body">
          <dt className="incident-detail__body__definition">Datum</dt>
          <dd className="incident-detail__body__value">{string2date(incident.created_at)}</dd>
          <dt className="incident-detail__body__definition">Tijd</dt>
          <dd className="incident-detail__body__value">{string2time(incident.created_at)}</dd>
          <dt className="incident-detail__body__definition">Datum overlast</dt>
          <dd className="incident-detail__body__value">{string2date(incident.incident_date_start)}</dd>
          <dt className="incident-detail__body__definition">Tijd overlast</dt>
          <dd className="incident-detail__body__value">{string2time(incident.incident_date_start)}</dd>
          <dt className="incident-detail__body__definition">Urgentie</dt>
          <dd className="incident-detail__body__value">{getListValueByKey(priorityList, incident.priority && incident.priority.priority)}&nbsp;</dd>
          <dt className="incident-detail__body__definition">Hoofdcategorie</dt>
          <dd className="incident-detail__body__value">{incident.category.main}&nbsp;</dd>
          <dt className="incident-detail__body__definition">Subcategorie</dt>
          <dd className="incident-detail__body__value">{incident.category.sub}&nbsp;</dd>
          <dt className="incident-detail__body__definition">Omschrijving</dt>
          <dd className="incident-detail__body__value pre-wrap">{incident.text}&nbsp;</dd>
          <dt className="incident-detail__body__definition">Aanvullende kenmerken</dt>
          <dd className="incident-detail__body__value">{incident.text_extra}&nbsp;</dd>
          {extraProperties}
          <div className={stadsdeelUpdated ? 'incident-detail__body--highlight' : ''}>
            <dt className="incident-detail__body__definition">Stadsdeel</dt>
            <dd className="incident-detail__body__value">{getListValueByKey(stadsdeelList, incident.location.stadsdeel)}&nbsp;</dd>
          </div>
          <div className={locationUpdated ? 'incident-detail__body--highlight' : ''}>
            <dt className="incident-detail__body__definition">Locatie</dt>
            <dd className="incident-detail__body__value">{incident.location.address_text || 'Locatie is gepind op de kaart'}&nbsp;</dd>
          </div>
          <dt className="incident-detail__body__definition">Email</dt>
          <dd className="incident-detail__body__value">{incident.reporter.email}</dd>
          <dt className="incident-detail__body__definition">Telefoonnummer</dt>
          <dd className="incident-detail__body__value">{incident.reporter.phone}</dd>
          <dt className="incident-detail__body__definition">Bron</dt>
          <dd className="incident-detail__body__value">{incident.source}</dd>
          <dt className="incident-detail__body__definition">Verantwoordelijke afdeling</dt>
          <dd className="incident-detail__body__value">{incident.category.department}&nbsp;</dd>
          <dt className="incident-detail__body__definition">Telefoonnummer</dt>
          <dd className="incident-detail__body__value">{incident.reporter.phone}</dd>
          {incident.parent_id ?
            (<span>
              <dt className="incident-detail__body__definition">Oorspronkelijke melding</dt>
              <dd className="incident-detail__body__value"><NavLink className="incident-detail__body__link" to={`/manage/incident/${incident.parent_id}`}>{incident.parent_id}</NavLink></dd>
            </span>)
            : ''}

          {incident.child_ids && incident.child_ids.length > 0 ?
                (<span>
                  <dt className="incident-detail__body__definition">Gesplitst in</dt>
                  <dd className="incident-detail__body__value">{incident.child_ids.map((child_id) =>
                    (<NavLink className="incident-detail__body__link" key={child_id} to={`/manage/incident/${child_id}`}>{child_id}</NavLink>))}</dd>
                </span>)
               : ''}
        </div>
      </div>
    );
  }
}

IncidentDetail.defaultProps = {
  location: {},
  locationUpdated: false,
  stadsdeelUpdated: false,
  locationTimer: null,
  stadsdeelTimer: null
};

IncidentDetail.propTypes = {
  incident: PropTypes.object.isRequired,
  location: PropTypes.object,
  locationUpdated: PropTypes.bool,
  stadsdeelUpdated: PropTypes.bool,
  priorityList: PropTypes.array.isRequired,
  stadsdeelList: PropTypes.array.isRequired
};

export default IncidentDetail;
