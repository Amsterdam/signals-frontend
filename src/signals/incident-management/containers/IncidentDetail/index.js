import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';
import styled from 'styled-components';

import {
  incidentType,
  dataListType,
  defaultTextsType,
  attachmentsType,
  categoriesType,
  historyType,
} from 'shared/types';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import {
  makeSelectLoading,
  makeSelectError,
  makeSelectCategories,
} from 'containers/App/selectors';
import {
  requestIncident,
  patchIncident,
  dismissSplitNotification,
  requestAttachments,
  requestDefaultTexts,
  dismissError,
} from 'models/incident/actions';
import { requestHistoryList } from 'models/history/actions';
import makeSelectIncidentModel from 'models/incident/selectors';
import makeSelectHistoryModel from 'models/history/selectors';

import './style.scss';

import DetailHeader from './components/DetailHeader';
import MetaList from './components/MetaList';
import History from './components/History';
import AddNote from './components/AddNote';
import LocationForm from './components/LocationForm';
import AttachmentViewer from './components/AttachmentViewer';
import StatusForm from './components/StatusForm';
import Detail from './components/Detail';
import SplitNotificationBar from './components/SplitNotificationBar';
import LocationPreview from './components/LocationPreview';

const DetailContainer = styled(Column)`
  flex-direction: column;
  position: relative;
`;

export const IncidentDetail = ({
  attachmentHref: attachment,
  categories,
  historyModel: { list },
  incidentModel: {
    incident,
    attachments,
    loading,
    patching,
    error,
    split,
    stadsdeelList,
    priorityList,
    changeStatusOptionList,
    defaultTextsOptionList,
    statusList,
    defaultTexts,
  },
  onDismissError,
  onDismissSplitNotification,
  onPatchIncident,
  onRequestAttachments,
  onRequestDefaultTexts,
  onRequestHistoryList,
  onRequestIncident,
  previewState: preview,
}) => {
  const { id } = useParams();
  const [previewState, setPreviewState] = useState(preview);
  const [attachmentHref, setAttachmentHref] = useState(attachment);

  const fetchAll = useCallback(() => {
    onRequestIncident(id);
    onRequestHistoryList(id);
    onRequestAttachments(id);
  }, [onRequestIncident, onRequestHistoryList, onRequestAttachments, id]);

  const onShowLocation = useCallback(() => {
    setPreviewState('showLocation');
    setAttachmentHref('');
  }, [setPreviewState, setAttachmentHref]);

  const onEditLocation = useCallback(() => {
    setPreviewState('editLocation');
    setAttachmentHref('');
  }, [setPreviewState, setAttachmentHref]);

  const onEditStatus = useCallback(() => {
    setPreviewState('editStatus');
    setAttachmentHref('');
  }, [setPreviewState, setAttachmentHref]);

  const onShowAttachment = useCallback(
    href => {
      setPreviewState('showImage');
      setAttachmentHref(href);
    },
    [setPreviewState, setAttachmentHref]
  );

  const onCloseAll = useCallback(() => {
    setPreviewState('');
    setAttachmentHref('');
  }, [setPreviewState, setAttachmentHref]);

  useEffect(() => {
    fetchAll();
  }, [id]);

  useEffect(() => {
    if (!incident) return;

    onRequestDefaultTexts({
      main_slug: incident.category.main_slug,
      sub_slug: incident.category.sub_slug,
    });
  }, [incident]);

  return (
    <Fragment>
      <div className="incident-detail">
        <Row>
          <Column span={12}>
            <SplitNotificationBar
              data={split}
              onDismissSplitNotification={onDismissSplitNotification}
            />
          </Column>
        </Row>

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
                    onClick={onCloseAll}
                  />

                  {previewState === 'showImage' && (
                    <AttachmentViewer
                      attachments={attachments}
                      href={attachmentHref}
                      onShowAttachment={onShowAttachment}
                    />
                  )}

                  {previewState === 'showLocation' && (
                    <LocationPreview
                      location={incident.location}
                      onEditLocation={onEditLocation}
                    />
                  )}

                  {previewState === 'editLocation' && (
                    <LocationForm
                      incident={incident}
                      patching={patching}
                      error={error}
                      onPatchIncident={onPatchIncident}
                      onDismissError={onDismissError}
                      onClose={onCloseAll}
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
                      onClose={onCloseAll}
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
                        onShowLocation={onShowLocation}
                        onEditLocation={onEditLocation}
                        onShowAttachment={onShowAttachment}
                      />

                      <AddNote id={id} onPatchIncident={onPatchIncident} />

                      <History list={list} />
                    </Fragment>
                  )}
                </DetailContainer>

                <DetailContainer span={4} push={1}>
                  {incident && (
                    <MetaList
                      incident={incident}
                      priorityList={priorityList}
                      subcategories={categories.sub}
                      onPatchIncident={onPatchIncident}
                      onEditStatus={onEditStatus}
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
};

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
    changeStatusOptionList: dataListType,
    defaultTextsOptionList: dataListType,
    statusList: dataListType,
    defaultTexts: defaultTextsType,
  }).isRequired,
  historyModel: PropTypes.shape({
    list: historyType.isRequired,
  }).isRequired,
  categories: categoriesType.isRequired,
  onRequestIncident: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
  onRequestHistoryList: PropTypes.func.isRequired,
  onRequestAttachments: PropTypes.func.isRequired,
  onRequestDefaultTexts: PropTypes.func.isRequired,
  onDismissSplitNotification: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
};

/* istanbul ignore next */
const mapStateToProps = () =>
  createStructuredSelector({
    categories: makeSelectCategories(),
    error: makeSelectError(),
    historyModel: makeSelectHistoryModel(),
    incidentModel: makeSelectIncidentModel(),
    loading: makeSelectLoading(),
  });

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onDismissError: dismissError,
      onDismissSplitNotification: dismissSplitNotification,
      onPatchIncident: patchIncident,
      onRequestAttachments: requestAttachments,
      onRequestDefaultTexts: requestDefaultTexts,
      onRequestHistoryList: requestHistoryList,
      onRequestIncident: requestIncident,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(IncidentDetail);
