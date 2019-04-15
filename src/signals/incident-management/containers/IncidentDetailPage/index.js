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
import { requestIncident, patchIncident, dismissSplitNotification } from 'models/incident/actions';
import { requestNotesList } from 'models/notes/actions';
import { requestHistoryList } from 'models/history/actions';
import makeSelectIncidentModel from 'models/incident/selectors';
import makeSelectNotesModel from 'models/notes/selectors';
import makeSelectHistoryModel from 'models/history/selectors';
import './style.scss';

import Header from './components/Header';
import MetaList from './components/MetaList';
import Notes from './components/Notes';
import History from './components/History';
import Tabs from './components/Tabs';

// import MapDetail from './components/MapDetail';
import IncidentDetail from './components/IncidentDetail';
// import IncidentCategoryContainer from '../IncidentCategoryContainer';
// import IncidentPriorityContainer from '../IncidentPriorityContainer';
// import IncidentStatusContainer from '../IncidentStatusContainer';
// import IncidentNotesContainer from '../IncidentNotesContainer';
// import LocationForm from '../LocationForm';
// import IncidentHistoryContainer from '../IncidentHistoryContainer';
import SplitNotificationBar from './components/SplitNotificationBar';

export class IncidentDetailPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.onTabChanged = this.onTabChanged.bind(this);
    this.onDismissSplitNotification = this.onDismissSplitNotification.bind(this);
    this.onShowLocation = this.onShowLocation.bind(this);
    this.onEditLocation = this.onEditLocation.bind(this);
    this.onShowAttachment = this.onShowAttachment.bind(this);

    this.default = {
      showLocation: false,
      editLocation: false,
      showImage: false,
      image: ''
    };
  }

  state = {
    selectedTab: 'notes',
    showLocation: false,
    editLocation: false,
    showImage: false,
    image: ''
  };

  componentDidMount() {
    this.props.onRequestIncident(this.props.id);
    this.props.onRequestNotesList(this.props.id);
    this.props.onRequestHistoryList(this.props.id);
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

  onDownloadPdf() {
    console.log('onDownloadPdf');
  }

  onThor() {
    console.log('onThor');
  }

  onDismissSplitNotification() {
    this.props.onDismissSplitNotification();
  }

  onShowLocation() {
    console.log('onShowLocation');
    this.setState({
      ...this.default,
      showLocation: true
    });
  }

  onEditLocation() {
    console.log('onEditLocation');
    this.setState({
      ...this.default,
      editLocation: true
    });
  }

  onShowAttachment(image) {
    console.log('onShowImage', image);
    this.setState({
      ...this.default,
      showImage: true,
      image
    });
  }

  render() {
    const { id, onPatchIncident } = this.props;
    const { incidentNotesList } = this.props.notesModel;
    const { list } = this.props.historyModel;
    const { incident, loading, split, stadsdeelList, priorityList } = this.props.incidentModel;
    const { selectedTab } = this.state;
    console.log('-', incident);
    const tabs = {
      // status: { name: 'Status', value: <IncidentStatusContainer id={this.props.id} /> },
      // priority: { name: 'Urgentie', value: <IncidentPriorityContainer id={this.props.id} /> },
      // category: { name: 'Subcategorie', value: <IncidentCategoryContainer id={this.props.id} /> },
      notes: { name: 'Notities', value: <Notes list={incidentNotesList} id={id} onPatchIncident={onPatchIncident} /> },
      // image: incident && incident.image ? { name: 'Foto', value: <img src={incident.image} alt={''} className="incident-detail-page__image--max-width" /> } : undefined,
      // location: { name: 'Locatie', value: <LocationForm id={this.props.id} /> },
      history: { name: 'Historie', value: <History list={list} /> }
    };

    return (
      <div className="incident-detail-page container">
        <SplitNotificationBar data={split} onClose={this.onDismissSplitNotification} />
        {loading ? <LoadingIndicator /> : (
          <div className="row">
            <div className="col-12">
              <Link to={`${this.props.baseUrl}/incidents`} className="startagain action" >Terug naar overzicht</Link>
            </div>

            {incident ?
              <Header
                incident={incident}
                baseUrl={this.props.baseUrl}
                onThor={this.onThor}
                onDownloadPdf={this.onDownloadPdf}
              /> : ''}


            <div className="col-8">
              {incident ? (
                <IncidentDetail
                  incident={incident}
                  stadsdeelList={stadsdeelList}
                  priorityList={priorityList}
                  onShowLocation={this.onShowLocation}
                  onEditLocation={this.onEditLocation}
                  onShowAttachment={this.onShowAttachment}
                />
                ) : ''}
            </div>

            <div className="col-4">
              {incident ? (
                <MetaList
                  incident={incident}
                  priorityList={priorityList}
                />
                ) : ''}
            </div>


            <div className="col-8">
              <Tabs
                onTabChanged={this.onTabChanged}
                selectedTab={selectedTab}
                tabs={tabs}
              />
            </div>

            <div className="col-8">
              <div className="incident-detail-page__tab-container">
                {tabs[selectedTab].value}
              </div>
            </div>
          </div>
          )}
      </div>
    );
  }
}

IncidentDetailPage.propTypes = {
  incidentModel: PropTypes.object.isRequired,
  notesModel: PropTypes.object.isRequired,
  historyModel: PropTypes.object.isRequired,

  id: PropTypes.string,
  baseUrl: PropTypes.string,

  onRequestIncident: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
  onRequestNotesList: PropTypes.func.isRequired,
  onRequestHistoryList: PropTypes.func.isRequired,
  onDismissSplitNotification: PropTypes.func.isRequired
};

/* istanbul ignore next */
const mapStateToProps = () => createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  incidentModel: makeSelectIncidentModel(),
  historyModel: makeSelectHistoryModel(),
  notesModel: makeSelectNotesModel()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncident: requestIncident,
  onPatchIncident: patchIncident,
  onRequestNotesList: requestNotesList,
  onRequestHistoryList: requestHistoryList,
  onDismissSplitNotification: dismissSplitNotification
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IncidentDetailPage);
