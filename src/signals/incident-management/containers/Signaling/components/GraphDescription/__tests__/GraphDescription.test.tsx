import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import GraphDescription from '..'

describe('<GraphDescription />', () => {
  it('should render correctly', () => {
    const props = {
      title: 'Titel',
      description: 'Omschrijving',
      total: 1234,
    }

    render(withAppContext(<GraphDescription {...props} />))

    expect(
      screen.getByRole('heading', { name: props.title })
    ).toBeInTheDocument()
    expect(screen.getByText('1.234')).toBeInTheDocument()
    expect(screen.getByText(props.description)).toBeInTheDocument()
  })
})
