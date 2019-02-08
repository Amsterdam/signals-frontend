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
import LoadingIndicator from 'shared/components/LoadingIndicator';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import { requestIncident } from 'models/incident/actions';
import { requestNotesList } from 'models/notes/actions';
import makeSelectIncidentModel from 'models/incident/selectors';
import makeSelectNotesModel from 'models/notes/selectors';
// import makeSelectIncidentDetailPage, { selectRefresh } from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

// import { requestNotesList } from './actions';
import Tabs from './components/Tabs';
import MapDetail from './components/MapDetail';
import IncidentDetail from './components/IncidentDetail';
import IncidentCategoryContainer from '../IncidentCategoryContainer';
import IncidentPriorityContainer from '../IncidentPriorityContainer';
import IncidentStatusContainer from '../IncidentStatusContainer';
import IncidentNotesContainer from '../IncidentNotesContainer';
import IncidentHistoryContainer from '../IncidentHistoryContainer';
import PrintLayout from './components/PrintLayout';

export class IncidentDetailPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.onTabChanged = this.onTabChanged.bind(this);
    this.onPrintView = this.onPrintView.bind(this);
  }

  state = {
    selectedTab: 'status',
    printView: false
  };

  componentDidMount() {
    this.props.onRequestIncident(this.props.id);
    this.props.onRequestNotesList(this.props.id);
  }

  onTabChanged(tabId) {
    this.setState({ selectedTab: tabId });
  }

  onPrintView() {
    this.setState({ printView: !this.state.printView });
  }

  render() {
    const { incidentNotesList } = this.props.notesModel;
    const { incident, loading, stadsdeelList, priorityList } = this.props.incidentModel;
    const { selectedTab } = this.state;
    const tabs = {
      status: { name: 'Status', value: <IncidentStatusContainer id={this.props.id} /> },
      priority: { name: 'Urgentie', value: <IncidentPriorityContainer id={this.props.id} /> },
      category: { name: 'Subcategorie', value: <IncidentCategoryContainer id={this.props.id} /> },
      notes: { name: 'Notities', value: <IncidentNotesContainer id={this.props.id} />, count: incident && incident.notes_count },
      image: incident && incident.image ? { name: 'Foto', value: <img src={incident.image} alt={''} className="incident-detail-page__image--max-width" /> } : undefined,
      history: { name: 'Historie', value: <IncidentHistoryContainer id={this.props.id} /> }
    };

    const view = this.state.printView ? (
      <PrintLayout
        id={this.props.id}
        incident={incident}
        incidentNotesList={incidentNotesList}
        stadsdeelList={stadsdeelList}
        priorityList={priorityList}
        onPrintView={this.onPrintView}
      />
      ) :
      (
        <div className="incident-detail-page container">
          {loading ? <LoadingIndicator /> : (
            <div className="row">
              <div className="col-12">
                <Link to={`${this.props.baseUrl}/incidents`} className="startagain action" >Terug naar overzicht</Link>
              </div>

              <div className="col-9"><h3>Melding {this.props.id}</h3></div>
              <div className="col-3 d-flex">
                <Link to={`${this.props.baseUrl}/incident/${this.props.id}/split`} className="align-self-center action-quad" >Splitsen</Link>
                <button className="align-self-center action-quad" onClick={this.onPrintView}>Print view</button>
              </div>

              <ul className="col-12 col-md-4 incident-detail-page__map">
                {incident && incident.location ? <MapDetail label="" value={incident.location} /> : ''}
              </ul>

              <div className="col-12 col-md-8">
                {incident ? (
                  <IncidentDetail
                    incident={incident}
                    stadsdeelList={stadsdeelList}
                    priorityList={priorityList}
                  />
                ) : ''}
              </div>

              <div className="col-12">
                <Tabs
                  onTabChanged={this.onTabChanged}
                  selectedTab={selectedTab}
                  tabs={tabs}
                />
              </div>

              <div className="col-12">
                <div className="incident-detail-page__tab-container">
                  {tabs[selectedTab].value}
                </div>
              </div>
            </div>
          )}
        </div>
      );

    return view;
  }
}

IncidentDetailPage.propTypes = {
  // incidentdetailpage: PropTypes.object.isRequired,
  incidentModel: PropTypes.object.isRequired,
  notesModel: PropTypes.object.isRequired,

  id: PropTypes.string,
  baseUrl: PropTypes.string,

  onRequestIncident: PropTypes.func.isRequired,
  onRequestNotesList: PropTypes.func.isRequired
};

/* istanbul ignore next */
const mapStateToProps = (/* state, ownProps */) => createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  // incidentdetailpage: makeSelectIncidentDetailPage(),
  incidentModel: makeSelectIncidentModel(),
  notesModel: makeSelectNotesModel(),

  // refresh: selectRefresh(ownProps.id)
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncident: requestIncident,
  onRequestNotesList: requestNotesList
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'incidentDetailPage', reducer });
const withSaga = injectSaga({ key: 'incidentDetailPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentDetailPage);
