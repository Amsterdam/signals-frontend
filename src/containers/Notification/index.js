import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import Notification from 'components/Notification';
import { makeSelectNotification } from 'containers/App/selectors';
import { resetGlobalNotification } from 'containers/App/actions';
import { TYPE_LOCAL } from './constants';

export const NotificationContainerComponent = ({
  notification,
  onResetNotification,
}) => {
  const history = useHistory();

  /**
   * Subscribe to history changes
   * Will reset the notification whenever a navigation action occurs and only when the type of the
   * notifcation is TYPE_LOCAL
   */
  useEffect(() => {
    if (notification.type !== TYPE_LOCAL) return undefined;

    const unlisten = history.listen(() => {
      onResetNotification();
    });

    return () => {
      unlisten();
      onResetNotification();
    };
  }, [history, onResetNotification, notification.type]);

  return (
    notification.title && (
      <Notification {...notification} onClose={onResetNotification} />
    )
  );
};

NotificationContainerComponent.propTypes = {
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

export default compose(withConnect)(NotificationContainerComponent);
