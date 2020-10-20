# TypeScirpt

Date: 2020-10-16

## Status

2020-10-16 Proposed
2020-10-19 Accepted

## Context

Currently TypeScript is not being used. For typing of component props PropTypes is being used.

## Decision

Making use of typing will make our code more readable and more reliable. Furthermore we don't need to use the PropTypes dependency anymore. TypeScript's interfaces and types are more reusable and adaptable than PropTypes.

Transition to TypeScript will be done gradually.

## Consequences

- Webpack and linting need to be set up accordingly.
- When transitioning to TypeScript we need to take unit tests along as well.
- When we start using GraphQL we can use generated TypeScript interfaces.
