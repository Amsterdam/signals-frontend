import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import { makeSelectCategories } from 'containers/App/selectors';


import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import SelectForm from './components/SelectForm';

import makeSelectDefaultTextsAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

export class DefaultTextsAdmin extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { defaultTextsOptionList } = this.props.defaultTextsAdmin;
    const { categories } = this.props;
    console.log('-', categories, defaultTextsOptionList);
    return (
      <div className="default-texts-admin">
        <div className="row">
          <div className="col-4">
            <SelectForm
              subcategories={categories.sub}
              statusList={defaultTextsOptionList}
            />
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
  defaultTextsAdmin: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired
};

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  // onRequestIncident: requestIncident,
}, dispatch);

const mapStateToProps = createStructuredSelector({
  defaultTextsAdmin: makeSelectDefaultTextsAdmin(),
  categories: makeSelectCategories()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'defaultTextsAdmin', reducer });
const withSaga = injectSaga({ key: 'defaultTextsAdmin', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DefaultTextsAdmin);
