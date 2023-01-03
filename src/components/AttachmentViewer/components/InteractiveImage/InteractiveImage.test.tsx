import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import InteractiveImage from './InteractiveImage'

describe('InteractiveImage', () => {
  it('sets visibility of main image when clicked', () => {
    render(<InteractiveImage src="foo" alt="bar" />)
    const image = screen.getByTestId('interactive-image')
    const zoomedImage = screen.getByTestId('zoomed-interactive-image')

    expect(image).toBeVisible()

    userEvent.click(image)

    expect(image).not.toBeVisible()

    userEvent.click(zoomedImage)

    expect(image).not.toBeVisible()

    userEvent.click(zoomedImage)

    expect(image).toBeVisible()
  })
})
