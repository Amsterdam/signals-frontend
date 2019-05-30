import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDefaultTextsAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';


export class DefaultTextsAdmin extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="default-texts-admin">
        <div className="row">
          <div className="col-4">
            SelectForm
          </div>
          <div className="col-4">
            DefaultTextsForm
          </div>
        </div>
      </div>
    );
  }
}

DefaultTextsAdmin.propTypes = {
};

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  // onRequestIncident: requestIncident,
}, dispatch);

const mapStateToProps = createStructuredSelector({
  defaulttextsadmin: makeSelectDefaultTextsAdmin(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'defaultTextsAdmin', reducer });
const withSaga = injectSaga({ key: 'defaultTextsAdmin', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DefaultTextsAdmin);
