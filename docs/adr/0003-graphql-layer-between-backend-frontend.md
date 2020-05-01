# GraphQL layer between backend and frontend

Date: 2020-04-30

## Status

**Accepted**

## Related tickets (not available for public)

SIG-2568

## Context

Since our current backend only serves data through REST and there is no possibility to generate
types and or interfaces, there is no also no automated way to validate data on the frontend
which is coming from the backend.

Besides of that there are too many inconstensies between different backend calls and the current
backend API documentation is not always correct and/or up to date because it's written manually
and not generated from code.

Because of this our `React components` are overcomplicated since we need to transform thr API output to a
format that the API can consume and that leads to bloat and too much client-side logic.

## Proposal

We would like to introduce a thin layer between the backend and our frontend which should expose
backend data through GraphQL Queries and should expose backend PUT/POST/DELETE actions via GraphQL
mutations.

We will also need to implement
[https://stackoverflow.com/questions/53531488/nestjs-why-do-we-need-dtos-and-interfaces-both-in-nestjs](Data Transfer Objects)
so we could create/use data contracts between backend and frontend.

# Technical requirements / proposals

Our GraphQL layer:

- Should be written in TypeScript so we can reuse as much as possible of our data definitions
  and will limit duplication as much as possible
- Should live in a Lerna mono repository so we will also be prepared to split our frontend in the
  future and can keep all frontend related code in one place
- Should take away as much logic from our components as possible so we could keep our
  components clean and sane
- Should generate types/interfaces/documentation automatically and straight from the code so
  we will always be sure our documentation/interfaces/types are up to date and will work as expected

# Backend Tools proposal

- [https://lerna.js.org/](Lerna): A tool for creating and managing mono repos
- [https://www.apollographql.com/](Apollo GraphQL): The industry standard GraphQL implementation
- [https://typegraphql.com](type-graphql): A library which allows you to write GraphQL definitions in TypeScript
- Express or Fastify: Middleware to serve our GraphQL layer
- [https://nestjs.com](NestJS): Glue between many modern NodeJS backend implementations and tools

# Frontend tools proposal

- [https://graphql-code-generator.com/](GraphQL Code Generator): Generate GraphQL types/clients/interfaces, etc.
- [https://github.com/apollographql/eslint-plugin-graphqlhl](eslint-plugin-graphql): Live GraphQL validation on the frontend
- [https://graphql.org/graphql-js/](GraphQL.js): Contains gql template function
  - [https://formidable.com/open-source/urql/](URQL - React GraphQL client, hooks, etc.): Library to work with GraphQL on the frontend

# Application structure proposal

## Backend

- logic: All logic should be placed in service files so they could be used in GraphQL resolvers
  and maybe in the future by REST controllers when needed, for example:
  *roles/roles.service.ts*
- graphql queries/mutations: GraphqQL queries and mutations should live in resolvers,
  for example:
  *roles/roles.resolver.ts*

## Frontend

- queries/mutations: GraphQL queries and mutations should live in one central place, for example:
  *src/graphql/roles.queries.js* and *src/graphql/roles.mutations.js* or
  *src/graphql/roles.graphql.js*

# Proof of Concept

Since this proposal is quite big it would be smart to start with a proof of concept with
strict requirements, here is a list of requirements:

- The POC should expose one full endpoint of our current API through GraphQL (roles)
- The POC should generate interfaces/API reference/types/GraphQL definitions fully automated
- The POC focuses on the GraphQL backend implementation but the frontend should implement
  at least one query and two mutations on the frontend
- The POC will have the test boiler plate in place
- The POC will have simple and concise documentation about how it has been setup
- The POC should be able to run in a Docker container

# Notes

- We should be careful with caching strategies and be sure we won't cache sensitive data
- As suggested we should take a look to DataLoader when this POC has been implemented:
  [https://github.com/graphql/dataloader](GraphQL DataLoader)
