import { useSelector } from 'react-redux'
import configuration from 'shared/services/configuration/configuration'
import {
  makeSelectUserCan,
  makeSelectUserCanAccess,
} from 'containers/App/selectors'
import Overview from './components/Overview'

export default function () {
  const userCanAccess = useSelector(makeSelectUserCanAccess)
  const userCan = useSelector(makeSelectUserCan)

  return (
    <Overview
      showItems={{
        settings: userCanAccess('settings'),
        departments: userCanAccess('departments'),
        groups: userCanAccess('groups'),
        users: userCanAccess('userForm'),
        categories: userCanAccess('categories'),
        export:
          configuration.featureFlags.enableCsvExport &&
          userCan('sia_signal_report'),
      }}
    />
  )
}
