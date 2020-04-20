# GraphQL layer between backend and frontend

Date: 2020-04-20

## Status

Draft

## Related tickets (not available for public)

SIG-2568

## Disclaimer

Since this proposal is quite big the original author (jpoppe) has taken the liberty make this
proposal a bit more opiniated then it normally should be. (One of the reasons is that the original
author has made this implementation and fine tuned it multiple times already)

## Context

Since our current backend only serves data through REST and there is no possibility to generate
generate types/interfaces there is no automated way to validate data on the frontend which is coming 
from the backend.

Besides of that there are too many inconstencies between different backend calls, and the current
backend API documentation is not always correct and/or up to date because it's written manually
and not generetated.

Because of this our `React components` are over complicated because we need to mangle data all the
time to be able to send a POST/PUT request from data which got from a GET request.

## Proposal

We would like to introduce a thin layer between the backend and our frontend which should expose
backend data through GraphQL Queries and should expose PUT/POST/DELETE actions through GraphQL
mutations.

We will also need to implement DTO's (Data Transfer Objects) so we can create/use data contracts
between backend and frontend.

## How

Since this proposal will take quite some time/impact to implement I propose to start a POC with one
endpoint which we could make acccessible through GraphQL.

# Technical requirements / proposals

Our GraphQL layer:

- Should be written in TypeScript so we can reuse as much as possible of our data definitions
  and will limit duplication as much as possible
- Should live in a Lerna mono repository so we will also be prepared to split our frontend in the
  future and can keep all frontend related code in one place
- Should take away as much logic from our components as possible so we could create an keep our
  components clean and sane
- Should generate types/interfaces/documentation automatically and straight from the code so
  we will always be sure our documentation/interfaces/types will work as expected

# Backend Tools proposal

- Lerna: A tool for creating and managing mono repos
- Graphql Apollo:
- type-graphql: A library which allows you to write GraphQL definitions in TypeScript
- Express/Fastify: Middleware to serve our GraphQL layer
- NestJS: Glue between many modern NodeJS backend development library

# Frontend tools proposal

- graphql-codegen: Generate GraphQL types/clients/interfaces, etc.
- eslint-plugin-graphql: Live GraphQL validation on the frontend
- graphql: Contains gql template function
- Apollo boost/client/react-hooks: Libraries to work with GraphQL on the frontend

# Application structure proposal

## Backend

- logic: All logic should be placed in service files, so they could be used in GraphQL resolvers,
  and maybe in the future by REST controllers when needed, for example: departments/departments.service.ts
- graphql queries/mutations: GraphqQL queries and mutations should live in resolvers,
  for example: departments/departments.resolver.ts

## Frontend

- queries/mutations: GraphQL queries and mutations should live in one central place, for example:
  src/graphql/departments.queries.js and src/graphql/departments.mutations.js or
  src/graphql/departments.graphql.js

# Proof of Concept

Since this proposal is quite big it would be smart to start with a proof of concept with
strict requirements, here is a possible list of requirements:

- The POC should expose one full endpoint of our current API through GraphQL (departments)
- The POC should generate interfaces/API reference/types/GraphQL definitions fully automated
- The POC should not take longer then 3 full working days to setup
- The POC focuses on the GraphQL backend implementation but the frontend should implement
  at least one query and two mutations on the frontend
- The POC will have the test boiler plate in place
- The POC will have simple and concise documentation about how it has been setup
- The POC won't use authentication to keep it simple
