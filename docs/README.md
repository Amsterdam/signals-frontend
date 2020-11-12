# Documentation

## [Architectural decision records](./adr/README.md)

All important architectural decisions that have been made, along with their context and consequences, are documented.

See this [reference on creating ADRs](https://github.com/joelparkerhenderson/architecture_decision_record).

## Schemas

### [Configuration schema](./schemas/README.md)

The application is split into multiple parts where the functionality lives in this repository and the corresponding configuration in another. Each configuration property is listed and described.

## [Serviceworker proxy](./serviceworker-proxy.md)

It can sometimes be useful to mock requests in the browser in order to test different UI presentations. For instance when a user's permission should dictate which menu items should be shown.

This behaviour can be accomplished by invoking a serviceworker that acts as a proxy that can return specific content for certain requests.

## [Additional questions](./additional-questions.md)

The second step of the incident wizard shows any additional questions available. These questions will be fetched from the backend with the feature flag `fetchQuestionsFromBackend` enabled. How to configure these questions is explained in detail.
