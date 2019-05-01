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
import { makeSelectLoading, makeSelectError, makeSelectCategories } from 'containers/App/selectors';
import { requestIncident, patchIncident, dismissSplitNotification, requestAttachments } from 'models/incident/actions';
import { requestHistoryList } from 'models/history/actions';
import makeSelectIncidentModel from 'models/incident/selectors';
import makeSelectHistoryModel from 'models/history/selectors';
import './style.scss';

import Header from './components/Header';
import MetaList from './components/MetaList';
import History from './components/History';
import AddNote from './components/AddNote';
import LocationForm from './components/LocationForm';
import ImageViewer from './components/ImageViewer';
import StatusForm from './components/StatusForm';

import MapDetail from './components/MapDetail';
import IncidentDetail from './components/IncidentDetail';
import SplitNotificationBar from './components/SplitNotificationBar';

export class IncidentDetailPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.onThor = this.onThor.bind(this);
    this.onDismissSplitNotification = this.onDismissSplitNotification.bind(this);
    this.onShowLocation = this.onShowLocation.bind(this);
    this.onEditLocation = this.onEditLocation.bind(this);
    this.onEditStatus = this.onEditStatus.bind(this);
    this.onShowAttachment = this.onShowAttachment.bind(this);
    this.onCloseAll = this.onCloseAll.bind(this);

    this.default = {
      showLocation: false,
      editLocation: false,
      editStatus: false,
      showImage: false,
      image: ''
    };
  }

  state = {
    showLocation: false,
    editLocation: false,
    editStatus: false,
    showImage: false,
    image: ''
  };

  componentDidMount() {
    this.props.onRequestIncident(this.props.id);
    this.props.onRequestHistoryList(this.props.id);
    this.props.onRequestAttachments(this.props.id);
  }

  shouldComponentUpdate(props) {
    if (props.id !== this.props.id) {
      props.onRequestIncident(props.id);
    }

    return true;
  }

  onThor() {
    const patch = {
      id: this.props.id,
      type: 'thor',
      patch: {
        status: {
          state: 'ready to send',
          text: 'Te verzenden naar THOR',
          target_api: 'sigmax'
        }
      }
    };

    this.props.onPatchIncident(patch);
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

  onEditStatus() {
    this.setState({
      ...this.default,
      editStatus: true
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
    const { id, onPatchIncident, categories } = this.props;
    const { list } = this.props.historyModel;
    const { incident, attachments, loading, split, stadsdeelList, priorityList, changeStatusOptionList } = this.props.incidentModel;
    const { showImage, showLocation, editLocation, editStatus, image } = this.state;

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
              /> : ''}

            {showImage || showLocation || editLocation || editStatus ? (
              <div className="col-12 incident-detail-page__preview">
                <button className="incident-detail-page__preview-close action-button-close" onClick={this.onCloseAll} />

                {showImage ? (
                  <ImageViewer
                    attachments={attachments}
                    image={image}
                    onShowAttachment={this.onShowAttachment}
                  />
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
                    onClose={this.onCloseAll}
                  />
                ) : ''}

                {editStatus ?
                  <StatusForm
                    incident={incident}
                    changeStatusOptionList={changeStatusOptionList}
                    onPatchIncident={onPatchIncident}
                    onClose={this.onCloseAll}
                  />
                : ''}
              </div>
            ) :
              (
                <div className="row">
                  <div className="col-7">
                    {incident ? (
                      <div>
                        <IncidentDetail
                          incident={incident}
                          attachments={attachments}
                          stadsdeelList={stadsdeelList}
                          priorityList={priorityList}
                          onShowLocation={this.onShowLocation}
                          onEditLocation={this.onEditLocation}
                          onShowAttachment={this.onShowAttachment}
                        />

                        <AddNote
                          id={id}
                          onPatchIncident={onPatchIncident}
                        />

                        <History
                          list={list}
                        />
                      </div>
                    ) : ''}
                  </div>

                  <div className="col-4 offset-1">
                    {incident ? (
                      <MetaList
                        incident={incident}
                        priorityList={priorityList}
                        subcategories={categories.sub}
                        onPatchIncident={onPatchIncident}
                        onEditStatus={this.onEditStatus}
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
  categories: PropTypes.object.isRequired,

  id: PropTypes.string,
  baseUrl: PropTypes.string,

  onRequestIncident: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
  onRequestHistoryList: PropTypes.func.isRequired,
  onRequestAttachments: PropTypes.func.isRequired,
  onDismissSplitNotification: PropTypes.func.isRequired
};

/* istanbul ignore next */
const mapStateToProps = () => createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  incidentModel: makeSelectIncidentModel(),
  categories: makeSelectCategories(),
  historyModel: makeSelectHistoryModel()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestIncident: requestIncident,
  onPatchIncident: patchIncident,
  onRequestHistoryList: requestHistoryList,
  onRequestAttachments: requestAttachments,
  onDismissSplitNotification: dismissSplitNotification
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IncidentDetailPage);
