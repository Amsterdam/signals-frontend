import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectIncidentCategoryContainer from './selectors';
import { makeSelectCategories } from '../../../../containers/App/selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';
import Add from './components/Add';
import { requestCategoryUpdate } from './actions';


export class IncidentCategoryContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { categories, incidentCategoryContainer: { loading } } = this.props;
    return (
      <div className="col-6">
        <div className="incident-edit-container">
          <Add
            id={this.props.id}
            subcategoryList={categories.subcacategories}
            loading={loading}
            onRequestCategoryUpdate={this.props.onRequestCategoryUpdate}
          />
        </div>
      </div>
    );
  }
}

IncidentCategoryContainer.propTypes = {
  id: PropTypes.string.isRequired,
  incidentCategoryContainer: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,

  onRequestCategoryUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  incidentCategoryContainer: makeSelectIncidentCategoryContainer()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestCategoryUpdate: requestCategoryUpdate,
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentCategoryContainer', reducer });
const withSaga = injectSaga({ key: 'incidentCategoryContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentCategoryContainer);
