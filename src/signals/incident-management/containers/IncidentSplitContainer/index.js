import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Row, Column, Heading, themeSpacing } from '@datapunt/asc-ui';
import { goBack } from 'connected-react-router/immutable';
import styled from 'styled-components';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import * as types from 'shared/types';
import { makeSelectDistricts } from 'signals/incident-management/selectors';

import { splitIncident } from './actions';

import reducer from './reducer';
import saga from './saga';

import SplitDetail from './components/SplitDetail';
import SplitForm from './components/SplitForm';
import useFetchIncident from './services/useFetchIncident';

const StyledH1 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`;

const StyledWrapper = styled.div`
  min-height: 800px;
`;

export const IncidentSplitContainer = ({ districts, onSplitIncident, onGoBack }) => {
  const { id } = useParams();
  const { isLoading, incident, attachments } = useFetchIncident(id);

  return (
    <StyledWrapper data-testid="incidentSplit">
      <Row>
        {isLoading ? (
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
              <SplitDetail districts={districts} incident={incident} />
            </Column>
          </Fragment>
        )}
      </Row>
    </StyledWrapper>
  );
};

IncidentSplitContainer.propTypes = {
  districts: types.dataListType,
  onSplitIncident: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  districts: makeSelectDistricts,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSplitIncident: splitIncident,
      onGoBack: goBack,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentSplitContainer', reducer });
const withSaga = injectSaga({ key: 'incidentSplitContainer', saga });

export default compose(withReducer, withSaga, withConnect)(IncidentSplitContainer);
