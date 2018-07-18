/**
 *
 * IncidentDetailPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import makeSelectIncidentDetailPage, { selectRefresh } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { requestIncident } from './actions';
import Tabs from './components/Tabs';
import MapDetail from './components/MapDetail';
import IncidentDetail from './components/IncidentDetail';
import IncidentCategoryContainer from '../IncidentCategoryContainer';
import IncidentStatusContainer from '../IncidentStatusContainer';


export class IncidentDetailPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.onTabChanged = this.onTabChanged.bind(this);
  }

  state = {
    selectedTab: 0
  };

  componentWillMount() {
    if (this.props.refresh) {
      this.props.onRequestIncident(this.props.id);
    }
  }

  onTabChanged(tabId) {
    this.setState({ selectedTab: tabId });
  }

  render() {
    const { incident } = this.props.incidentdetailpage;
    const { selectedTab } = this.state;
    const tabs = [
      { name: 'Status', value: <IncidentStatusContainer id={this.props.id} /> },
      { name: 'Categorie', value: <IncidentCategoryContainer id={this.props.id} /> },
    ];

    return (
      <div className="incident-detail-page row container">
        <div className="col-12"><h3>Melding {this.props.id}</h3>
        </div>
        <ul className="col-4 incident-detail-page__map">
          {(incident) ? <MapDetail label="" value={incident.location} /> : ''}
        </ul>
        <div className="col-8">
          (<Link to={`${this.props.baseUrl}/incidents`} >Terug naar overzicht</Link>)
          {(incident) ? <IncidentDetail incident={incident} /> : ''}
        </div>

        <div className="col-12">
          <Tabs onTabChanged={this.onTabChanged} selectedTab={selectedTab} tabs={['Status', 'Categorie']} />
        </div>

        <div className="col-12">
          <div className="incident-detail-page__tab-container">
            {tabs[selectedTab].value}
          </div>
        </div>
      </div>
    );
  }
}

IncidentDetailPage.propTypes = {
  incidentdetailpage: PropTypes.object.isRequired,

  id: PropTypes.string,
  baseUrl: PropTypes.string,
  refresh: PropTypes.bool,

  onRequestIncident: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  incidentdetailpage: makeSelectIncidentDetailPage(),

  refresh: selectRefresh(ownProps.id)
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncident: requestIncident
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'incidentDetailPage', reducer });
const withSaga = injectSaga({ key: 'incidentDetailPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentDetailPage);
