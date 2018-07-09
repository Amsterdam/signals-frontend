import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectIncidentCategoryContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.scss';


export class IncidentCategoryContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="indcident-edit-container">
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

IncidentCategoryContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  indcidentcategorycontainer: makeSelectIncidentCategoryContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'indcidentCategoryContainer', reducer });
const withSaga = injectSaga({ key: 'indcidentCategoryContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentCategoryContainer);
