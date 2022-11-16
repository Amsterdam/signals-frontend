import { incidentsDetail } from './incidents-detail'
import { incidentsList } from './incidents-list'

export const providerMock = {
  email: 'test@test.nl',
  setEmail: jest.fn(),
  incidentsList,
  setIncidentsList: jest.fn(),
  incidentsDetail,
  setIncidentDetail: jest.fn(),
}
