import React from 'react';
import PropTypes from 'prop-types';
import PlainText from '../PlainText';

const CommaArray = ({ value, ...props }) => <PlainText value={value.join(', ')} {...props} />;

CommaArray.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CommaArray;
