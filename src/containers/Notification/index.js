import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import Notification from 'components/Notification';
import { makeSelectNotification } from 'containers/App/selectors';
import { resetGlobalNotification } from 'containers/App/actions';

export const NotificationContainer = ({
  notification,
  onResetNotification,
}) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      onResetNotification();
    });

    return () => {
      unlisten();
    };
  }, []);
  return <Notification {...notification} onClose={onResetNotification} />;
};

NotificationContainer.propTypes = {
  notification: PropTypes.shape({}),
  onResetNotification: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notification: makeSelectNotification(),
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onResetNotification: resetGlobalNotification,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(NotificationContainer);
