import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { isEqual } from 'lodash';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import './style.scss';


class IncidentDetail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      location: props.incident.location,
      locationUpdated: props.locationUpdated,
      stadsdeelUpdated: props.stadsdeelUpdated
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      locationUpdated: !isEqual(props.incident.location, state.location),
      stadsdeelUpdated: !isEqual(props.incident.location.stadsdeel, state.location.stadsdeel)
    };
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
              <tr><td>Stadsdeel</td><td className={stadsdeelUpdated ? 'incident-detail__body--highlight' : ''}>{getListValueByKey(stadsdeelList, incident.location.stadsdeel)}</td></tr>
              <tr><td>Adres</td><td className={locationUpdated ? 'incident-detail__body--highlight' : ''}>{incident.location.address_text}</td></tr>
              <tr><td>Email</td><td>{incident.reporter.email}</td></tr>
              <tr><td>Telefoonnummer</td><td>{incident.reporter.phone}</td></tr>
              <tr><td>Bron</td><td>{incident.source}</td></tr>
              <tr><td>Verantwoordelijke afdeling</td><td>{incident.category.department}&nbsp;</td></tr>
              {incident.parent_id ?
               (<tr>
                 <td>Oorspronkelijke melding</td>
                 <td><NavLink className="incident-detail__link" to={`/manage/incident/${incident.parent_id}`}>{incident.parent_id}</NavLink></td>
               </tr>)
               : <tr></tr>}
              {incident.child_ids && incident.child_ids.length > 0 ?
                (<tr>
                  <td>Gesplitst in</td>
                  <td>{incident.child_ids.map((child_id) =>
                    (<NavLink className="incident-detail__link" key={child_id} to={`/manage/incident/${child_id}`}>{child_id}</NavLink>))}</td>
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
  stadsdeelUpdated: false
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
