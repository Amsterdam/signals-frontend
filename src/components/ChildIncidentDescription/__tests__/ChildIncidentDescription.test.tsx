import { render, screen } from '@testing-library/react'

import ChildIncidentDescription from '../ChildIncidentDescription'

describe('ChildIncidentDescription', () => {
  it('should render description', () => {
    const text = 'foo'
    render(<ChildIncidentDescription canView text={text} />)

    expect(screen.queryByText('foo')).toBeInTheDocument()
  })

  it('should render "-" when canView is false', () => {
    const text = 'foo'
    render(<ChildIncidentDescription canView={false} text={text} />)

    expect(screen.queryByText('foo')).not.toBeInTheDocument()
    expect(screen.queryByText('-')).toBeInTheDocument()
  })
})
