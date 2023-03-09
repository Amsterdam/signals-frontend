import { render, screen } from '@testing-library/react'

import GraphEmpty from '../index'

describe('<GraphEmpty />', () => {
  it('should render correctly', () => {
    const props = {
      text: 'Tekst',
    }

    render(<GraphEmpty {...props} />)

    expect(screen.getByText(props.text)).toBeInTheDocument()
  })
})
