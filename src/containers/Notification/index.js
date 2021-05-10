// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'

import Notification from 'components/Notification'
import { makeSelectNotification } from 'containers/App/selectors'
import { resetGlobalNotification } from 'containers/App/actions'

export const NotificationContainerComponent = ({
  notification,
  onResetNotification,
}) =>
  notification.title ? (
    <Notification {...notification} onClose={onResetNotification} />
  ) : null

NotificationContainerComponent.propTypes = {
  notification: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  onResetNotification: PropTypes.func.isRequired,
}

const mapStateToProps = createStructuredSelector({
  notification: makeSelectNotification(),
})

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onResetNotification: resetGlobalNotification,
    },
    dispatch
  )

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(NotificationContainerComponent)
