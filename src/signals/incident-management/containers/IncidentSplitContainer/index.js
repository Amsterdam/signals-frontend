import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { Row, Column, Heading, themeSpacing } from '@datapunt/asc-ui';
import { goBack } from 'connected-react-router/immutable';
import styled from 'styled-components';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import { requestIncident, requestAttachments } from 'models/incident/actions';
import makeSelectIncidentModel from 'models/incident/selectors';
import { incidentType, attachmentsType } from 'shared/types';

import { splitIncident } from './actions';

import reducer from './reducer';
import saga from './saga';

import SplitDetail from './components/SplitDetail';
import SplitForm from './components/SplitForm';

const StyledH1 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`;

const StyledWrapper = styled.div`
  min-height: 800px;
`;

export const IncidentSplitContainer = ({
  incidentModel: { incident, attachments, loading },
  onRequestIncident,
  onRequestAttachments,
  onSplitIncident,
  onGoBack,
}) => {
  const { id } = useParams();

  useEffect(() => {
    onRequestIncident(id);
    onRequestAttachments(id);
  }, [id, onRequestIncident, onRequestAttachments]);

  return (
    <StyledWrapper>
      <Row>
        {loading && !incident ? (
          <LoadingIndicator />
        ) : (
          <Fragment>
            <Column span={12}>
              <StyledH1 forwardedAs="h1">Splitsen</StyledH1>
            </Column>

            <Column span={7}>
              <SplitForm
                incident={incident}
                attachments={attachments}
                onHandleSubmit={onSplitIncident}
                onHandleCancel={onGoBack}
              />
            </Column>
            <Column span={4} push={1}>
              <SplitDetail incident={incident} />
            </Column>
          </Fragment>
        )}
      </Row>
    </StyledWrapper>
  );
};

IncidentSplitContainer.defaultProps = {
  incidentModel: null,
};

IncidentSplitContainer.propTypes = {
  incidentModel: PropTypes.shape({
    incident: incidentType,
    attachments: attachmentsType,
    loading: PropTypes.bool,
  }),
  onRequestIncident: PropTypes.func.isRequired,
  onRequestAttachments: PropTypes.func.isRequired,
  onSplitIncident: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  incidentModel: makeSelectIncidentModel,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onRequestIncident: requestIncident,
      onRequestAttachments: requestAttachments,
      onSplitIncident: splitIncident,
      onGoBack: goBack,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentSplitContainer', reducer });
const withSaga = injectSaga({ key: 'incidentSplitContainer', saga });

export default compose(withReducer, withSaga, withConnect)(IncidentSplitContainer);
