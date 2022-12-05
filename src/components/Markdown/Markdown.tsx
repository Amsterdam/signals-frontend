// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { Link as AscLink } from '@amsterdam/asc-ui'
import ReactMarkdown from 'react-markdown'
import type { ReactMarkdownOptions } from 'react-markdown'
import styled from 'styled-components'

import Paragraph from 'components/Paragraph'

const Link = styled(AscLink)`
  font-size: inherit;
`

type Props = {
  hideTabindexLink?: boolean
  children: ReactNode
} & ReactMarkdownOptions

const Markdown = ({ children, hideTabindexLink, ...props }: Props) => (
  <ReactMarkdown
    components={{
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      a: ({ node, ...props }) => (
        <Link
          tabIndex={hideTabindexLink ? -1 : 0}
          variant="inline"
          {...props}
        />
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      p: ({ node, color, ...props }) => <Paragraph {...props} />,
    }}
    {...props}
  >
    {children}
  </ReactMarkdown>
)

export default Markdown
