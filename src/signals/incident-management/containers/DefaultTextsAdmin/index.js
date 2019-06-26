import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import { makeSelectCategories } from 'containers/App/selectors';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import SelectForm from './components/SelectForm';
import DefaultTextsForm from './components/DefaultTextsForm';

import { fetchDefaultTexts, storeDefaultTexts, orderDefaultTexts } from './actions';
import makeSelectDefaultTextsAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

export class DefaultTextsAdmin extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { defaultTexts, defaultTextsOptionList, categoryUrl, state } = this.props.defaultTextsAdmin;
    const { categories, onFetchDefaultTexts, onSubmitTexts, onOrderDefaultTexts } = this.props;

    return (
      <div className="default-texts-admin">
        <div className="row">
          <div className="col-12">
            <h1>Beheer standaard teksten</h1>
          </div>
          <div className="col-4">
            <SelectForm
              subCategories={categories.sub}
              statusList={defaultTextsOptionList}
              onFetchDefaultTexts={onFetchDefaultTexts}
            />
          </div>
          <div className="col-8">
            <DefaultTextsForm
              defaultTexts={defaultTexts}
              categoryUrl={categoryUrl}
              subCategories={categories.sub}
              state={state}
              onSubmitTexts={onSubmitTexts}
              onOrderDefaultTexts={onOrderDefaultTexts}
            />
          </div>
        </div>
      </div>
    );
  }
}

DefaultTextsAdmin.propTypes = {
  defaultTextsAdmin: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,

  onFetchDefaultTexts: PropTypes.func.isRequired,
  onSubmitTexts: PropTypes.func.isRequired,
  onOrderDefaultTexts: PropTypes.func.isRequired
};

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onFetchDefaultTexts: fetchDefaultTexts,
  onSubmitTexts: storeDefaultTexts,
  onOrderDefaultTexts: orderDefaultTexts,
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
