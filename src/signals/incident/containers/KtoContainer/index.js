import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';
import { withRouter } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectKtoContainer from './selectors';
import reducer from './reducer';
import saga from './saga';

import {
  updateKto, requestKtoAnswers, checkKto, storeKto,
} from './actions';
import KtoForm from './components/KtoForm';

export const headerStrings = {
  ja: 'Ja, ik ben tevreden met de behandeling van mijn melding',
  nee: 'Nee, ik ben niet tevreden met de behandeling van mijn melding',
  finished: 'Bedankt voor uw feedback!',
  tooLate: 'Helaas, de mogelijkheid om feedback te geven is verlopen',
  filledOut: 'Er is al feedback gegeven voor deze melding',
};

const renderHeader = type => {
  switch (type) {
    case 'ja':
      return <h1>{headerStrings.ja}</h1>;

    case 'nee':
      return <h1>{headerStrings.nee}</h1>;

    case 'finished':
      return (
        <header>
          <h1>{headerStrings.finished}</h1>
          <p>We zijn voortdurend bezig onze dienstverlening te verbeteren.</p>
        </header>
      );

    case 'too late':
      return (
        <header>
          <h1>{headerStrings.tooLate}</h1>
          <p>
            Na het afhandelend van uw melding heeft u 2 weken de gelegenheid om
            feedback te geven.
          </p>
        </header>
      );

    case 'filled out':
      return (
        <header>
          <h1>{headerStrings.filledOut}</h1>
          <p>
            Nogmaals bedankt voor uw feedback. We zijn voortdurend bezig onze
            dienstverlening te verbeteren.
          </p>
        </header>
      );
    default:
      return null;
  }
};

export const KtoContainerComponent = ({
  requestKtoAnswersAction,
  checkKtoAction,
  ktoContainer,
  onUpdateKto,
  onStoreKto,
  match,
}) => {
  const {
    params: { yesNo, uuid },
  } = match;

  useEffect(() => {
    requestKtoAnswersAction(yesNo === 'ja');
    checkKtoAction(uuid);
  }, [requestKtoAnswersAction, checkKtoAction, yesNo, uuid]);

  if (ktoContainer.statusError) {
    return (
      <Row>
        <Column span={12}>{renderHeader(ktoContainer.statusError)}</Column>
      </Row>
    );
  }

  if (ktoContainer.ktoFinished) {
    return (
      <Row>
        <Column span={12}>{renderHeader('finished')}</Column>
      </Row>
    );
  }

  return (
    <Fragment>
      <Row>
        <Column span={12}>{renderHeader(yesNo)}</Column>
      </Row>

      <Row>
        <Column
          span={{
            small: 2, medium: 2, big: 8, large: 8, xLarge: 8,
          }}
        >
          <KtoForm
            ktoContainer={ktoContainer}
            onUpdateKto={onUpdateKto}
            onStoreKto={onStoreKto}
          />
        </Column>
      </Row>
    </Fragment>
  );
};

KtoContainerComponent.defaultProps = {
  ktoContainer: {},
};

KtoContainerComponent.propTypes = {
  ktoContainer: PropTypes.shape({
    statusError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    ktoFinished: PropTypes.bool.isRequired,
  }),
  onUpdateKto: PropTypes.func.isRequired,
  onStoreKto: PropTypes.func.isRequired,
  requestKtoAnswersAction: PropTypes.func.isRequired,
  checkKtoAction: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      yesNo: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = createStructuredSelector({
  ktoContainer: makeSelectKtoContainer(),
});

export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    onUpdateKto: updateKto,
    onStoreKto: storeKto,
    requestKtoAnswersAction: requestKtoAnswers,
    checkKtoAction: checkKto,
  },
  dispatch,
);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'ktoContainer', reducer });
const withSaga = injectSaga({ key: 'ktoContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withRouter,
)(KtoContainerComponent);
