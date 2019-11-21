import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Heading, Row, Column, themeSpacing } from '@datapunt/asc-ui';
import styled from 'styled-components';

import { categoriesType, dataListType, defaultTextsType } from 'shared/types';
import { makeSelectCategories } from 'containers/App/selectors';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import SelectForm from './components/SelectForm';
import DefaultTextsForm from './components/DefaultTextsForm';

import {
  fetchDefaultTexts,
  storeDefaultTexts,
  orderDefaultTexts,
} from './actions';
import makeSelectDefaultTextsAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';

const StyledH1 = styled(Heading)`
  font-weight: normal;
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`;

const DefaultTextsAdmin = ({
  categories,
  onFetchDefaultTexts,
  onSubmitTexts,
  onOrderDefaultTexts,
  defaultTextsAdmin: {
    defaultTexts,
    defaultTextsOptionList,
    categoryUrl,
    state,
  },
}) => (
  <Fragment>
    <Row>
      <Column span={12}>
        <StyledH1>Beheer standaard teksten</StyledH1>
      </Column>
      <Column span={4}>
        <SelectForm
          subCategories={categories.sub}
          defaultTextsOptionList={defaultTextsOptionList}
          onFetchDefaultTexts={onFetchDefaultTexts}
        />
      </Column>

      <Column span={8}>
        <DefaultTextsForm
          defaultTexts={defaultTexts}
          categoryUrl={categoryUrl}
          subCategories={categories.sub}
          state={state}
          onSubmitTexts={onSubmitTexts}
          onOrderDefaultTexts={onOrderDefaultTexts}
        />
      </Column>
    </Row>
  </Fragment>
);

DefaultTextsAdmin.defaultProps = {
  defaultTextsAdmin: {
    defaultTexts: [],
    defaultTextsOptionList: [],
    categoryUrl: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
    state: 'o',
  },
};

DefaultTextsAdmin.propTypes = {
  defaultTextsAdmin: PropTypes.shape({
    defaultTexts: defaultTextsType,
    defaultTextsOptionList: dataListType,
    categoryUrl: PropTypes.string,
    state: PropTypes.string,
  }),
  categories: categoriesType.isRequired,

  onFetchDefaultTexts: PropTypes.func.isRequired,
  onSubmitTexts: PropTypes.func.isRequired,
  onOrderDefaultTexts: PropTypes.func.isRequired,
};

export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    onFetchDefaultTexts: fetchDefaultTexts,
    onSubmitTexts: storeDefaultTexts,
    onOrderDefaultTexts: orderDefaultTexts,
  },
  dispatch,
);

const mapStateToProps = createStructuredSelector({
  defaultTextsAdmin: makeSelectDefaultTextsAdmin(),
  categories: makeSelectCategories(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'defaultTextsAdmin', reducer });
const withSaga = injectSaga({ key: 'defaultTextsAdmin', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DefaultTextsAdmin);
