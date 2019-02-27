/**
 *
 * IncidentDetailPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import { requestIncident, dismissSplitNotification } from 'models/incident/actions';
import { requestNotesList } from 'models/notes/actions';
import makeSelectIncidentModel from 'models/incident/selectors';
import makeSelectNotesModel from 'models/notes/selectors';
import './style.scss';

import Tabs from './components/Tabs';
import MapDetail from './components/MapDetail';
import IncidentDetail from './components/IncidentDetail';
import IncidentCategoryContainer from '../IncidentCategoryContainer';
import IncidentPriorityContainer from '../IncidentPriorityContainer';
import IncidentStatusContainer from '../IncidentStatusContainer';
import IncidentNotesContainer from '../IncidentNotesContainer';
import IncidentHistoryContainer from '../IncidentHistoryContainer';
import PrintLayout from './components/PrintLayout';
import SplitNotificationBar from './components/SplitNotificationBar';

export class IncidentDetailPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.onTabChanged = this.onTabChanged.bind(this);
    this.onPrintView = this.onPrintView.bind(this);
    this.onDismissSplitNotification = this.onDismissSplitNotification.bind(this);
  }

  state = {
    selectedTab: 'status',
    printView: false
  };

  componentDidMount() {
    this.props.onRequestIncident(this.props.id);
    this.props.onRequestNotesList(this.props.id);
  }

  shouldComponentUpdate(props) {
    if (props.id !== this.props.id) {
      props.onRequestIncident(props.id);
    }

    return true;
  }

  onTabChanged(tabId) {
    this.setState({ selectedTab: tabId });
  }

  onPrintView() {
    this.setState({ printView: !this.state.printView });
  }

  onDismissSplitNotification() {
    this.props.onDismissSplitNotification();
  }

  render() {
    const { incidentNotesList } = this.props.notesModel;
    const { incident, loading, split, stadsdeelList, priorityList } = this.props.incidentModel;
    const { selectedTab } = this.state;
    const tabs = {
      status: { name: 'Status', value: <IncidentStatusContainer id={this.props.id} /> },
      priority: { name: 'Urgentie', value: <IncidentPriorityContainer id={this.props.id} /> },
      category: { name: 'Subcategorie', value: <IncidentCategoryContainer id={this.props.id} /> },
      notes: { name: 'Notities', value: <IncidentNotesContainer id={this.props.id} />, count: incidentNotesList && incidentNotesList.length },
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
          <SplitNotificationBar data={split} onClose={this.onDismissSplitNotification} />
          {loading ? <LoadingIndicator /> : (
            <div className="row">
              <div className="col-12">
                <Link to={`${this.props.baseUrl}/incidents`} className="startagain action" >Terug naar overzicht</Link>
              </div>

              <div className="col-9"><h3>Melding {this.props.id}</h3></div>
              <div className="col-3 d-flex justify-content-end">
                {incident && incident.status && incident.status.state === 'm' ? <Link to={`${this.props.baseUrl}/incident/${this.props.id}/split`} className="align-self-center action-quad" >Splitsen</Link> : ''}
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
  incidentModel: PropTypes.object.isRequired,
  notesModel: PropTypes.object.isRequired,

  id: PropTypes.string,
  baseUrl: PropTypes.string,

  onRequestIncident: PropTypes.func.isRequired,
  onRequestNotesList: PropTypes.func.isRequired,
  onDismissSplitNotification: PropTypes.func.isRequired
};

/* istanbul ignore next */
const mapStateToProps = () => createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  incidentModel: makeSelectIncidentModel(),
  notesModel: makeSelectNotesModel()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncident: requestIncident,
  onRequestNotesList: requestNotesList,
  onDismissSplitNotification: dismissSplitNotification
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IncidentDetailPage);
