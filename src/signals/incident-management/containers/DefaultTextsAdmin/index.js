import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column } from '@datapunt/asc-ui';
import PageHeader from 'components/PageHeader';
import styled from 'styled-components';

// import { makeSelectCategories } from 'containers/App/selectors';

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
  statusList,
  defaultTextsAdmin: {
    defaultTexts,
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
          statusList={statusList}
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
  defaultTextsAdmin: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  onFetchDefaultTexts: PropTypes.func.isRequired,
  onSubmitTexts: PropTypes.func.isRequired,
  onOrderDefaultTexts: PropTypes.func.isRequired,
  onSaveDefaultTextsItem: PropTypes.func.isRequired,
  statusList: PropTypes.shape({}).isRequired,
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
  // categories: makeSelectCategories(),
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
