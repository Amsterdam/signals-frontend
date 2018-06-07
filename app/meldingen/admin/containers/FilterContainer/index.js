/**
 *
 * FilterContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectFilterContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.scss';


export class FilterContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="filter-container">
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

FilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  filtercontainer: makeSelectFilterContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'filterContainer', reducer });
const withSaga = injectSaga({ key: 'filterContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FilterContainer);
