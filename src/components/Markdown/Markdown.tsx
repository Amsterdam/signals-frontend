import ReactMarkdown from 'react-markdown'
import { Link as AscLink } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import type { FC } from 'react'
import type { ReactMarkdownOptions } from 'react-markdown'

import Paragraph from 'components/Paragraph'

const Link = styled(AscLink)`
  font-size: inherit;
`

const Markdown: FC<ReactMarkdownOptions> = ({ children, ...props }) => (
  <ReactMarkdown
    components={{
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      a: ({ node, ...props }) => (
        <Link tabIndex={-1} variant="inline" {...props} />
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
