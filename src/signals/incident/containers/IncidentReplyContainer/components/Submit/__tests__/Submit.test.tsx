import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import Submit from '..'

describe('<Submit />', () => {
  it('should render a submit button', () => {
    render(withAppContext(<Submit />))

    expect(screen.getByRole('button', { name: 'Verstuur' })).toBeInTheDocument()
  })
})
