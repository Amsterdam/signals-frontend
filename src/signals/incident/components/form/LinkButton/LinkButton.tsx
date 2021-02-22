import React from 'react';
import { Button as AscButton, Heading } from '@amsterdam/asc-ui';
import ReactMarkdown from 'react-markdown';

interface ButtonProps {
  meta: {
    label: string;
    title: string;
    href: string;
  };
}

const LinkButton: React.FC<ButtonProps> = ({ meta: { label, href, title } }) => (
  <div>
    <Heading as="h2" styleAs="h3">{title}</Heading>
    <AscButton type="button" variant="primary" as="a" href={href}>
      <ReactMarkdown>{label}</ReactMarkdown>
    </AscButton>
  </div>
);

export default LinkButton;
