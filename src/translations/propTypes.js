import PropTypes from 'prop-types';

export const MessageDescriptor = PropTypes.shape({
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired
});
