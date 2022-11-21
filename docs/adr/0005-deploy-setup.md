# Deploy setup

Date: 2020-07-27

## Status

Accepted

## Context

Previously, the application was split into [multiple parts](./0004-multi-tenant-architecture.md) for functionality and [configuration](./0003-application-configuration-setup.md). The result of those actions is an application that is split in the following repositories:

- [signals-frontend](https://github.com/Amsterdam/signals-frontend)
- [signals-amsterdam](https://github.com/Amsterdam/signals-amsterdam)
- [signals-weesp](https://github.com/Amsterdam/signals-weesp) and
- [signals-amsterdamsebos](https://github.com/Amsterdam/signals-amsterdamsebos) (does not exist)

The first repository in the list contains the functionality and the others contain domain specific configuration. At deployment, a Docker image of the first repository is created and pushed to the Docker repository by a Github actions job. Note that only tags can be deployed.

Said job, in turn, starts other Container jobs that create and push images for the domain specific repositories based on the first repository's image. This allows us to deploy images that are specific to an environment (acceptance, production) and for a specific configuration (Amsterdam, Weesp, Amsterdamse bos).

Where the separation of concerns at first seemed to be a good idea, it turns out to be error prone, susceptible to race conditions and with a relative large administrative overhead.

- Error prone because of the nature of the separation; configuration requirements in the base repository are only validated after building and deploying a domain specific repository, instead of very early on in the deployment process.

- Susceptible to race conditions; the base repository's Container registery jobs creates different Docker images (all tagged with `ois/signalsfrontend:latest`) at different moments in time, but at the same time, the domain specific repositories rely on those images to contain the correct code. This could lead to a situation where a Docker image of the `develop` branch of the base repository is created and where a deploy of one of the domain specific repositories is started (as a rollout to production for whatever reason). Instead of the latter using an image based on the `master` branch, it's using an image with functionality that has not yet been approved and should not be released, but still is.

- Administrative overhead, because a single configuration change in the base repository spawns a pull request and requires us to tag and document a new release and do that three times for each domain specific repository, apart from the pull request and tagged release that we create in the base repository.

## Decision

The [Amsterdam/signals-frontend](https://github.com/Amsterdam/signals-frontend) repository will remain the base repository and will have tagged releases, as is currently the case.

### Development

The [Amsterdam/signals-frontend](https://github.com/Amsterdam/signals-frontend) repository will keep its actions that run `lint`, `test` and `build` commands for every pull request.

Schema validation at Docker runtime should be taken out.

### Deployment

Each 'package' can be deployed independently from the other 'packages' and all packages can be deployed all at once.


## Consequences

The proposed transformation will make it easier to create another application in the future, if necessary. It will also reduce complexity and margin for error compared to the current setup.
