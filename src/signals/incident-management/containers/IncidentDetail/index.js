import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import isEqual from 'lodash.isequal';
import { Row, Column } from '@datapunt/asc-ui';
import styled from 'styled-components';

import {
  incidentType,
  dataListType,
  defaultTextsType,
  attachmentsType,
  historyType,
} from 'shared/types';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import {
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import { makeSelectSubCategories } from 'models/categories/selectors';
import {
  requestIncident,
  patchIncident,
  requestAttachments,
  requestDefaultTexts,
  dismissError,
} from 'models/incident/actions';
import { requestHistoryList } from 'models/history/actions';
import makeSelectIncidentModel from 'models/incident/selectors';
import makeSelectHistoryModel from 'models/history/selectors';
import History from 'components/History';

import './style.scss';

import ChildIncidents from './components/ChildIncidents';
import DetailHeader from './components/DetailHeader';
import MetaList from './components/MetaList';
import AddNote from './components/AddNote';
import LocationForm from './components/LocationForm';
import AttachmentViewer from './components/AttachmentViewer';
import StatusForm from './components/StatusForm';
import Detail from './components/Detail';
import LocationPreview from './components/LocationPreview';

const DetailContainer = styled(Column)`
  flex-direction: column;
  position: relative;
`;

export class IncidentDetail extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      previewState: props.previewState, // showLocation, editLocation, editStatus, showImage
      attachmentHref: props.attachmentHref,
    };

    this.onShowLocation = this.onShowLocation.bind(this);
    this.onEditLocation = this.onEditLocation.bind(this);
    this.onEditStatus = this.onEditStatus.bind(this);
    this.onShowAttachment = this.onShowAttachment.bind(this);
    this.onCloseAll = this.onCloseAll.bind(this);
  }

  componentDidMount() {
    this.fetchAll();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchAll();
    }

    /* istanbul ignore else */
    if (this.props.incidentModel.incident) {
      const category = this.props.incidentModel.incident.category;
      if (
        !isEqual(
          prevProps.incidentModel.incident &&
            prevProps.incidentModel.incident.category,
          this.props.incidentModel.incident.category
        )
      ) {
        this.props.onRequestDefaultTexts({
          main_slug: category.main_slug,
          sub_slug: category.sub_slug,
        });
      }
    }
  }

  onShowLocation() {
    this.setState({
      previewState: 'showLocation',
      attachmentHref: '',
    });
  }

  onEditLocation() {
    this.setState({
      previewState: 'editLocation',
      attachmentHref: '',
    });
  }

  onEditStatus() {
    this.setState({
      previewState: 'editStatus',
      attachmentHref: '',
    });
  }

  onShowAttachment(attachmentHref) {
    this.setState({
      previewState: 'showImage',
      attachmentHref,
    });
  }

  onCloseAll() {
    this.setState({
      previewState: '',
      attachmentHref: '',
    });
  }

  fetchAll() {
    this.props.onRequestIncident(this.props.match.params.id);
    this.props.onRequestHistoryList(this.props.match.params.id);
    this.props.onRequestAttachments(this.props.match.params.id);
  }

  render() {
    const {
      match: {
        params: { id },
      },
      subCategories,
      onPatchIncident,
      onDismissError,
    } = this.props;
    const { list } = this.props.historyModel;
    const {
      attachments,
      changeStatusOptionList,
      defaultTexts,
      defaultTextsOptionList,
      error,
      incident,
      loading,
      patching,
      priorityList,
      stadsdeelList,
      statusList,
      typesList,
    } = this.props.incidentModel;
    const { previewState, attachmentHref } = this.state;

    return (
      <Fragment>
        <div className="incident-detail">
          {loading && <LoadingIndicator />}

          {!loading && (
            <Fragment>
              {incident && (
                <Row>
                  <Column span={12}>
                    <DetailHeader
                      incident={incident}
                      baseUrl="/manage"
                      onPatchIncident={onPatchIncident}
                    />
                  </Column>
                </Row>
              )}

              {previewState && (
                <Row>
                  <DetailContainer span={12}>
                    <button
                      className="incident-detail__preview-close incident-detail__button--close"
                      type="button"
                      onClick={this.onCloseAll}
                    />

                    {previewState === 'showImage' && (
                      <AttachmentViewer
                        attachments={attachments}
                        href={attachmentHref}
                        onShowAttachment={this.onShowAttachment}
                      />
                    )}

                    {previewState === 'showLocation' && (
                      <LocationPreview
                        location={incident.location}
                        onEditLocation={this.onEditLocation}
                      />
                    )}

                    {previewState === 'editLocation' && (
                      <LocationForm
                        incidentId={incident.id}
                        location={incident.location}
                        onPatchIncident={onPatchIncident}
                        onClose={this.onCloseAll}
                      />
                    )}

                    {previewState === 'editStatus' && (
                      <StatusForm
                        incident={incident}
                        patching={patching}
                        error={error}
                        changeStatusOptionList={changeStatusOptionList}
                        defaultTextsOptionList={defaultTextsOptionList}
                        statusList={statusList}
                        defaultTexts={defaultTexts}
                        onPatchIncident={onPatchIncident}
                        onDismissError={onDismissError}
                        onClose={this.onCloseAll}
                      />
                    )}
                  </DetailContainer>
                </Row>
              )}

              {!previewState && (
                <Row>
                  <DetailContainer span={7}>
                    {incident && (
                      <Fragment>
                        <Detail
                          incident={incident}
                          attachments={attachments}
                          stadsdeelList={stadsdeelList}
                          onShowLocation={this.onShowLocation}
                          onEditLocation={this.onEditLocation}
                          onShowAttachment={this.onShowAttachment}
                        />

                        <AddNote id={id} onPatchIncident={onPatchIncident} />

                        <ChildIncidents incident={incident} />

                        <History list={list} />
                      </Fragment>
                    )}
                  </DetailContainer>

                  <DetailContainer span={4} push={1}>
                    {incident && subCategories && (
                      <MetaList
                        incident={incident}
                        priorityList={priorityList}
                        typesList={typesList}
                        subcategories={subCategories}
                        onPatchIncident={onPatchIncident}
                        onEditStatus={this.onEditStatus}
                      />
                    )}
                  </DetailContainer>
                </Row>
              )}
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}

IncidentDetail.defaultProps = {
  previewState: '',
  attachmentHref: '',
};

IncidentDetail.propTypes = {
  previewState: PropTypes.string,
  attachmentHref: PropTypes.string,

  incidentModel: PropTypes.shape({
    incident: incidentType,
    attachments: attachmentsType,
    loading: PropTypes.bool.isRequired,
    patching: PropTypes.shape({
      location: PropTypes.bool,
      status: PropTypes.bool,
    }).isRequired,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    split: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    stadsdeelList: dataListType,
    priorityList: dataListType,
    typesList: dataListType,
    changeStatusOptionList: dataListType,
    defaultTextsOptionList: dataListType,
    statusList: dataListType,
    defaultTexts: defaultTextsType,
  }).isRequired,
  historyModel: PropTypes.shape({
    list: historyType.isRequired,
  }).isRequired,
  subCategories: dataListType,

  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),

  onRequestIncident: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
  onRequestHistoryList: PropTypes.func.isRequired,
  onRequestAttachments: PropTypes.func.isRequired,
  onRequestDefaultTexts: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
};

/* istanbul ignore next */
const mapStateToProps = () =>
  createStructuredSelector({
    loading: makeSelectLoading(),
    error: makeSelectError(),
    incidentModel: makeSelectIncidentModel,
    subCategories: makeSelectSubCategories,
    historyModel: makeSelectHistoryModel(),
  });

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onRequestIncident: requestIncident,
      onPatchIncident: patchIncident,
      onRequestHistoryList: requestHistoryList,
      onRequestAttachments: requestAttachments,
      onRequestDefaultTexts: requestDefaultTexts,
      onDismissError: dismissError,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(IncidentDetail);
