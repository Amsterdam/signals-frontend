import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { isEqual } from 'lodash';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import './style.scss';

const HIGHLIGHT_TIMEOUT_INTERVAL = 2200;

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
      (<tr key={key}><td>{key}</td><td>{incident.extra_properties[key]}&nbsp;</td></tr>)
    );

    return (
      <div className="incident-detail">
        <div className="incident-detail__body">
          <table className="" cellSpacing="0" cellPadding="0">
            <tbody>
              <tr><td>Datum</td><td>{string2date(incident.created_at)}</td></tr>
              <tr><td>Tijd</td><td>{string2time(incident.created_at)}</td></tr>
              <tr><td>Datum overlast</td><td>{string2date(incident.incident_date_start)}</td></tr>
              <tr><td>Tijd overlast</td><td>{string2time(incident.incident_date_start)}</td></tr>
              <tr><td>Urgentie</td><td>{getListValueByKey(priorityList, incident.priority && incident.priority.priority)}&nbsp;</td></tr>
              <tr><td>Hoofdcategorie</td><td>{incident.category.main}&nbsp;</td></tr>
              <tr><td>Subcategorie</td><td>{incident.category.sub}&nbsp;</td></tr>
              <tr><td>Omschrijving</td><td className="pre-wrap">{incident.text}&nbsp;</td></tr>
              <tr><td>Aanvullende kenmerken</td><td>{incident.text_extra}&nbsp;</td></tr>
              {extraProperties}
              <tr className={stadsdeelUpdated ? 'incident-detail__body--highlight' : ''}><td>Stadsdeel</td><td>{getListValueByKey(stadsdeelList, incident.location.stadsdeel)}</td></tr>
              <tr className={locationUpdated ? 'incident-detail__body--highlight' : ''}><td>Locatie</td><td>{incident.location.address_text || 'Locatie is gepind op de kaart'}</td></tr>
              <tr><td>Email</td><td>{incident.reporter.email}</td></tr>
              <tr><td>Telefoonnummer</td><td>{incident.reporter.phone}</td></tr>
              <tr><td>Bron</td><td>{incident.source}</td></tr>
              <tr><td>Verantwoordelijke afdeling</td><td>{incident.category.department}&nbsp;</td></tr>
              {incident.parent_id ?
               (<tr>
                 <td>Oorspronkelijke melding</td>
                 <td><NavLink className="incident-detail__body__link" to={`/manage/incident/${incident.parent_id}`}>{incident.parent_id}</NavLink></td>
               </tr>)
               : <tr></tr>}
              {incident.child_ids && incident.child_ids.length > 0 ?
                (<tr>
                  <td>Gesplitst in</td>
                  <td>{incident.child_ids.map((child_id) =>
                    (<NavLink className="incident-detail__body__link" key={child_id} to={`/manage/incident/${child_id}`}>{child_id}</NavLink>))}</td>
                </tr>)
               : <tr></tr>}
            </tbody>
          </table>
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
