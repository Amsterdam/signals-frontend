import { useSelector } from 'react-redux'
import { makeSelectUserCanAccess } from 'containers/App/selectors'
import Overview from './components/Overview'

export default function () {
  const userCanAccess = useSelector(makeSelectUserCanAccess)

  return (
    <Overview
      showItems={{
        departments: userCanAccess('departments'),
        groups: userCanAccess('groups'),
        settings: userCanAccess('settings'),
        users: userCanAccess('userForm'),
        categories: userCanAccess('categories'),
      }}
    />
  )
}
