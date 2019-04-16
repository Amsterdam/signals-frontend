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
import History from './components/History';
import LocationForm from './components/LocationForm';
import ImageViewer from './components/ImageViewer';

import MapDetail from './components/MapDetail';
import IncidentDetail from './components/IncidentDetail';
import SplitNotificationBar from './components/SplitNotificationBar';

export class IncidentDetailPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.onTabChanged = this.onTabChanged.bind(this);
    this.onDismissSplitNotification = this.onDismissSplitNotification.bind(this);
    this.onShowLocation = this.onShowLocation.bind(this);
    this.onEditLocation = this.onEditLocation.bind(this);
    this.onShowAttachment = this.onShowAttachment.bind(this);
    this.onCloseAll = this.onCloseAll.bind(this);

    this.default = {
      showLocation: false,
      editLocation: false,
      showImage: false,
      image: ''
    };
  }

  state = {
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
    this.setState({
      ...this.default,
      showLocation: true
    });
  }

  onEditLocation() {
    this.setState({
      ...this.default,
      editLocation: true
    });
  }

  onShowAttachment(image) {
    this.setState({
      ...this.default,
      showImage: true,
      image
    });
  }

  onCloseAll() {
    this.setState({
      ...this.default
    });
  }

  render() {
    const { onPatchIncident } = this.props;
    const { list } = this.props.historyModel;
    const { incident, loading, split, stadsdeelList, priorityList } = this.props.incidentModel;
    const { showImage, showLocation, editLocation, image } = this.state;

    return (
      <div className="incident-detail-page">
        <SplitNotificationBar data={split} onClose={this.onDismissSplitNotification} />
        {loading ? <LoadingIndicator /> : (
          <div>
            <div className="row">
              <div className="col-12">
                <Link to={`${this.props.baseUrl}/incidents`} className="startagain action" >Terug naar overzicht</Link>
              </div>
            </div>

            {incident ?
              <Header
                incident={incident}
                baseUrl={this.props.baseUrl}
                onThor={this.onThor}
                onDownloadPdf={this.onDownloadPdf}
              /> : ''}

            {showImage || showLocation || editLocation ? (
              <div className="col-12 incident-detail-page__preview">
                <button className="incident-detail-page__preview-close action-button-close" onClick={this.onCloseAll} />

                {showImage ? (
                  <ImageViewer image={image} />
                ) : ''}

                {showLocation ? (
                  <MapDetail
                    value={incident.location}
                    zoom="16"
                  />
                ) : ''}

                {editLocation ? (
                  <LocationForm
                    incidentModel={this.props.incidentModel}
                    onPatchIncident={onPatchIncident}
                    onCancel={this.onCloseAll}
                  />
                ) : ''}
              </div>
            ) :
              (
                <div className="row">
                  <div className="col-7">
                    {incident ? (
                      <div>
                        <IncidentDetail
                          incident={incident}
                          stadsdeelList={stadsdeelList}
                          priorityList={priorityList}
                          onShowLocation={this.onShowLocation}
                          onEditLocation={this.onEditLocation}
                          onShowAttachment={this.onShowAttachment}
                        />

                        <History list={list} />
                      </div>
                    ) : ''}
                  </div>

                  <div className="col-4 offset-1">
                    {incident ? (
                      <MetaList
                        incident={incident}
                        priorityList={priorityList}
                      />
                    ) : ''}
                  </div>
                </div>
              )
            }


          </div>
          )}
      </div>
    );
  }
}

IncidentDetailPage.propTypes = {
  incidentModel: PropTypes.object.isRequired,
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
