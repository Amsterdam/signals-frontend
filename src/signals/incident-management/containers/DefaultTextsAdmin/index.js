import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Heading, Row, Column, themeSpacing } from '@datapunt/asc-ui';
import styled from 'styled-components';

import { dataListType, defaultTextsType } from 'shared/types';
import { makeSelectSubCategories } from 'models/categories/selectors';
import LoadingIndicator from 'shared/components/LoadingIndicator';

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
  margin-bottom: ${themeSpacing(8)};
  margin-top: ${themeSpacing(6)};
`;

export const DefaultTextsAdminContainer = ({
  subCategories,
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
  <Row>
    <Column span={12}>
      <StyledH1>Beheer standaard teksten</StyledH1>
    </Column>

    {!subCategories && <LoadingIndicator />}

    <Column span={4}>
      {subCategories && (
        <SelectForm
          subCategories={subCategories}
          defaultTextsOptionList={defaultTextsOptionList}
          onFetchDefaultTexts={onFetchDefaultTexts}
        />
      )}
    </Column>

    <Column span={8}>
      {subCategories && (
        <DefaultTextsForm
          defaultTexts={defaultTexts}
          categoryUrl={categoryUrl}
          subCategories={subCategories}
          state={state}
          onSubmitTexts={onSubmitTexts}
          onOrderDefaultTexts={onOrderDefaultTexts}
        />
      )}
    </Column>
  </Row>
);

DefaultTextsAdminContainer.defaultProps = {
  defaultTextsAdmin: {
    defaultTexts: [],
    defaultTextsOptionList: [],
    categoryUrl: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
    state: 'o',
  },
};

DefaultTextsAdminContainer.propTypes = {
  defaultTextsAdmin: PropTypes.shape({
    defaultTexts: defaultTextsType,
    defaultTextsOptionList: dataListType,
    categoryUrl: PropTypes.string,
    state: PropTypes.string,
  }),
  subCategories: dataListType,

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
  subCategories: makeSelectSubCategories,
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
)(DefaultTextsAdminContainer);
