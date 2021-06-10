import { render } from '@testing-library/react'
import { mockIncident } from 'types/api/incident.mock'
import { withAppContext } from 'test/utils'
import IncidentDetail from '../'

describe('IncidentDetail', () => {
  it('should render', () => {
    render(
      withAppContext(
        <IncidentDetail incident={mockIncident()} onBack={jest.fn()} />
      )
    )
  })
})
