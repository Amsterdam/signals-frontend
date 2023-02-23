import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import Markdown from '.'

describe('Markdown', () => {
  it('renders children', () => {
    render(withAppContext(<Markdown>Hic sunt dracones</Markdown>))

    expect(screen.getByText('Hic sunt dracones')).toBeInTheDocument()
  })

  it('parses markdown', () => {
    render(
      withAppContext(
        <Markdown>
          Hic sunt [dracones](https://nl.wikipedia.org/wiki/Hic_sunt_dracones)
        </Markdown>
      )
    )

    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByText('Hic sunt')).toBeInTheDocument()
  })

  it('parses an unordered list', () => {
    render(
      withAppContext(<Markdown allowedElements={['ul', 'li']}>- Test</Markdown>)
    )
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('parses an ordered list', () => {
    render(
      withAppContext(
        <Markdown allowedElements={['ol', 'li']}>1. Test</Markdown>
      )
    )
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('skips unallowed markdown', () => {
    render(
      withAppContext(
        <Markdown allowedElements={['a', 'p']}>## Heading level 2</Markdown>
      )
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
