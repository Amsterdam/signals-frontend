import { render, screen } from '@testing-library/react'

import { SignalingContainer } from './SignalingContainer'
import { withAppContext } from '../../../../test/utils'

describe('<SignalingContainer />', () => {
  it('should render correctly', async () => {
    render(withAppContext(<SignalingContainer />))

    // Loading
    expect(screen.getByText('Signalering')).toBeInTheDocument()
  })
})
