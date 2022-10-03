// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useDispatch, useSelector } from 'react-redux'

import SiteHeader from 'components/SiteHeader'
import {
  makeSelectUserCan,
  makeSelectUserCanAccess,
} from 'containers/App/selectors'

import { doLogout } from '../App/actions'

export const SiteHeaderContainer = () => {
  const userCan = useSelector(makeSelectUserCan)
  const userCanAccess = useSelector(makeSelectUserCanAccess)
  const dispatch = useDispatch()
  return (
    <SiteHeader
      onLogOut={() => dispatch(doLogout())}
      showItems={{
        defaultTexts: userCan('sia_statusmessagetemplate_write'),
        departments: userCanAccess('departments'),
        groups: userCanAccess('groups'),
        settings: userCanAccess('settings'),
        users: userCanAccess('userForm'),
        categories: userCanAccess('categories'),
      }}
    />
  )
}

export default SiteHeaderContainer
