// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import {
  Link as AscLink,
  List as AscList,
  OrderedList as AscOrderedList,
  ListItem,
} from '@amsterdam/asc-ui'
import ReactMarkdown from 'react-markdown'
import type { ReactMarkdownOptions } from 'react-markdown'
import styled from 'styled-components'

import Paragraph from 'components/Paragraph'

const Link = styled(AscLink)`
  font-size: 1rem;
`

const List = styled(AscList)`
  display: flex;
  flex-direction: column;

  li {
    line-height: 1.5;
    font-size: 1rem;
  }
`

const OrderedList = styled(AscOrderedList)`
  display: flex;
  flex-direction: column;

  li {
    line-height: 1.5;
    font-size: 1rem;
  }
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
      ul: ({ node, ...props }) => <List variant="bullet" {...props} />,
      ol: ({ node, ...props }) => <OrderedList {...props} />,
      li: ({ node, ...props }) => <ListItem {...props} />,
    }}
    {...props}
  >
    {children}
  </ReactMarkdown>
)

export default Markdown
