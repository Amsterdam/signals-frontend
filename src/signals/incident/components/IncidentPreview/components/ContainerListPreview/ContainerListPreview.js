import React from 'react';
import PropTypes from 'prop-types';
import ContainerList from '../../../form/ContainerSelect/ContainerList';

const ContainerListPreview = ({ value }) => <ContainerList selection={value} />;

ContainerListPreview.propTypes = {
  value: PropTypes.array,
};

export default ContainerListPreview;
