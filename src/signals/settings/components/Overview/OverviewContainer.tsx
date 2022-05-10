import { useSelector } from 'react-redux'
import { makeSelectUserCanAccess } from 'containers/App/selectors'
import Overview from './components/Overview'

export default function OverviewContainer() {
  const userCanAccess = useSelector(makeSelectUserCanAccess)

  return (
    <Overview
      showItems={{
        settings: userCanAccess('settings'),
        departments: userCanAccess('departments'),
        groups: userCanAccess('groups'),
        users: userCanAccess('userForm'),
        categories: userCanAccess('categories'),
      }}
    />
  )
}
