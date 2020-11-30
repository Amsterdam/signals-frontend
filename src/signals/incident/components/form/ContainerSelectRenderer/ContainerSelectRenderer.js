import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import ContainerSelect from '../ContainerSelect';

const ContainerSelectRenderer = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) =>
  meta?.isVisible && (
    <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
      <ContainerSelect handler={handler} meta={meta} parent={parent} />
    </Header>
  );

ContainerSelectRenderer.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
};

export default ContainerSelectRenderer;
