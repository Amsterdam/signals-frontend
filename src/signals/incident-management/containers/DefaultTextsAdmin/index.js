import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';
import PageHeader from 'components/PageHeader';
import styled from 'styled-components';
import * as types from 'shared/types';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import SelectForm from './components/SelectForm';
import DefaultTextsForm from './components/DefaultTextsForm';

import {
  fetchDefaultTexts,
  storeDefaultTexts,
  orderDefaultTexts,
  saveDefaultTextsItem,
} from './actions';
import makeSelectDefaultTextsAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

const StyledPageHeader = styled(PageHeader)`
  background-color: transparent;
`;

const DefaultTextsAdmin = ({
  categories,
  onFetchDefaultTexts,
  onSubmitTexts,
  onOrderDefaultTexts,
  onSaveDefaultTextsItem,
  defaultTextsAdmin: {
    defaultTexts,
    defaultTextsOptionList,
    categoryUrl,
    state,
  },
}) => (
  <Fragment>
    <StyledPageHeader title="Beheer standaard teksten" />
    <Row>
      <Column span={4}>
        <SelectForm
          subCategories={categories.sub}
          statusList={defaultTextsOptionList}
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
          onSaveDefaultTextsItem={onSaveDefaultTextsItem}
        />
      </Column>
    </Row>
  </Fragment>
);

DefaultTextsAdmin.propTypes = {
  defaultTextsAdmin: PropTypes.shape({
    defaultTexts: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      }),
    ),
    defaultTextsOptionList: types.dataList.isRequired,
    categoryUrl: PropTypes.string,
    state: PropTypes.string,
  }).isRequired,
  categories: types.categories.isRequired,
  onFetchDefaultTexts: PropTypes.func.isRequired,
  onSubmitTexts: PropTypes.func.isRequired,
  onOrderDefaultTexts: PropTypes.func.isRequired,
  onSaveDefaultTextsItem: PropTypes.func.isRequired,
};

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onFetchDefaultTexts: fetchDefaultTexts,
      onSubmitTexts: storeDefaultTexts,
      onOrderDefaultTexts: orderDefaultTexts,
      onSaveDefaultTextsItem: saveDefaultTextsItem,
    },
    dispatch,
  );

const mapStateToProps = createStructuredSelector({
  defaultTextsAdmin: makeSelectDefaultTextsAdmin(),
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
