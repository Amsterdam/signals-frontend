/**
 *
 * IncidentDetailPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import makeSelectIncidentDetailPage, { selectRefresh } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { requestIncident } from './actions';


export class IncidentDetailPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.requestIncident = this.props.requestIncident.bind(this);
  }

  componentWillMount() {
    if (this.props.refresh) {
      this.requestIncident(this.props.id);
    }
  }

  render() {
    const { incident, loading } = this.props.incidentdetailpage;
    return (
      <div className="incident-detail-page row container">
        <div className="col-12"><h3>Melding {this.props.id}</h3>
        </div>
        <ul className="col-6 incident-detail-page__map">
          {/* <li><FormattedMessage {...messages.header} /></li> */}
          {/* <li>Id={this.props.id}</li> */}
          <li>Kaart wordt hier getoond</li>
          {/* <li>{JSON.stringify(incident)}</li> */}
        </ul>
        <div className="col-6">
          (<Link to={`${this.props.baseUrl}/incidents`} >Terug naar overzicht</Link>)
          {(incident) ?
            <dl className="horizontal">
              <dt>Datum</dt>
              <dd>{incident.incident_date}</dd>
              <dt>Tijd</dt><dd>{incident.user}</dd>
              <dt>Stadsdeel</dt><dd>{incident.location.stadsdeel}</dd>
              <dt>Rubriek</dt><dd>{incident.subcategory}</dd>
              <dt>Afdeling</dt><dd>{incident.department}</dd>
              <dt>Status</dt><dd>{incident.current_state.state}</dd>
              <dt>Adres</dt><dd>{incident.user}</dd>
            </dl>
            : ''
          }
        </div>
        <div className="col-12">
          {loading ? 'Wordt geladen' : ''}
        </div>

      </div>
    );
  }
}

IncidentDetailPage.propTypes = {
  requestIncident: PropTypes.func.isRequired,
  incidentdetailpage: PropTypes.object.isRequired,

  id: PropTypes.string,
  baseUrl: PropTypes.string,
  refresh: PropTypes.bool
};


const mapStateToProps = (state, ownProps) => createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  incidentdetailpage: makeSelectIncidentDetailPage(),
  refresh: selectRefresh(ownProps.id)
});

function mapDispatchToProps(dispatch) {
  return {
    requestIncident: (id) => dispatch(requestIncident(id)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'incidentDetailPage', reducer });
const withSaga = injectSaga({ key: 'incidentDetailPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentDetailPage);
