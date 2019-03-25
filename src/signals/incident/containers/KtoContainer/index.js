import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectKtoContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { updateKto, requestKtaAnswers, checkKto, storeKto } from './actions';
import KtoForm from './components/KtoForm';

export class KtoContainer extends React.Component {
  componentWillMount() {
    this.props.requestKtaAnswers(this.props.yesNo);
    this.props.checkKto(this.props.uuid);
  }

  render() {
    const { ktoContainer, onUpdateKto, onStoreKto, yesNo } = this.props;
    return (
      <div className="kto-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>{yesNo === 'ja' ? 'Ja, ik ben tevreden met de behandeling van mijn melding' : 'Nee, ik ben niet tevreden met de behandeling van mijn melding'}</h1>

              <KtoForm
                ktoContainer={ktoContainer}
                onUpdateKto={onUpdateKto}
                onStoreKto={onStoreKto}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

KtoContainer.defaultProps = {
  ktoContainer: {
    form: {},
    answers: {}
  }
};

KtoContainer.propTypes = {
  uuid: PropTypes.string.isRequired,
  yesNo: PropTypes.string.isRequired,
  ktoContainer: PropTypes.object,

  onUpdateKto: PropTypes.func.isRequired,
  onStoreKto: PropTypes.func.isRequired,
  requestKtaAnswers: PropTypes.func.isRequired,
  checkKto: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  ktoContainer: makeSelectKtoContainer(),
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onUpdateKto: updateKto,
  onStoreKto: storeKto,
  requestKtaAnswers,
  checkKto
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'ktoContainer', reducer });
const withSaga = injectSaga({ key: 'ktoContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(KtoContainer);
