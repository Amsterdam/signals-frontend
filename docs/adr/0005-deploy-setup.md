# Deploy setup

Date: 2020-07-27

## Status

2020-07-27 proposed

## Context

Previously, the application was split into [multiple parts](./0004-multi-tenant-architecture.md) for functionality and [configuration](./0003-application-configuration-setup.md). The result of those actions is an application that is split in the following repositories:

- [signals-frontend](https://github.com/Amsterdam/signals-frontend)
- [signals-amsterdam](https://github.com/Amsterdam/signals-amsterdam)
- [signals-weesp](https://github.com/Amsterdam/signals-weesp) and
- [signals-amsterdamsebos](https://github.com/Amsterdam/signals-amsterdamsebos) (does not exist)

The first repository in the list contains the functionality and the others contain domain specific configuration. At deployment, a Docker image of the first repository is created and pushed to the Docker repository by a Jenkins job. Note that only tags and the `develop` branch can be deployed.

Said job, in turn, starts other Jenkins jobs that create and push images for the domain specific repositories based on the first repository's image. This allows us to deploy images that are specific to an environment (acceptance, production) and for a specific configuration (Amsterdam, Weesp, Amsterdamse bos).

Where the separation of concerns at first seemed to be a good idea, it turns out to be error prone, susceptible to race conditions and with a relative large administrative overhead.

- Error prone because of the nature of the separation; configuration requirements in the base repository are only validated after building and deploying a domain specific repository, instead of very early on in the deployment process.

- Susceptible to race conditions; the base repository's Jenkins jobs creates different Docker images (all tagged with `ois/signalsfrontend:latest`) at different moments in time, but at the same time, the domain specific repositories rely on those images to contain the correct code. This could lead to a situation where a Docker image of the `develop` branch of the base repository is created and where a deploy of one of the domain specific repositories is started (as a rollout to production for whatever reason). Instead of the latter using an image based on the `master` branch, it's using an image with functionality that has not yet been approved and should not be released, but still is.

- Administrative overhead, because a single configuration change in the base repository spawns a pull request and requires us to tag and document a new release and do that three times for each domain specific repository, apart from the pull request and tagged release that we create in the base repository.

## Decision

All domain specific repositories will be combined into [a single repository](https://github.com/Amsterdam/signalen). This repository will contain a separate 'package' (or whatever you want to call it) that contains domain specific configuration.

The `signals-frontend` repository will remain the base repository and will have tagged releases, as is currently the case. The `Dockerfile`, `Jenkinsfile` and `docker-compose.yml` will be moved to [Amsterdam/signalen](https://github.com/Amsterdam/signalen). That also goes for the `start.sh` script that applies the right configuration to the corresponding Docker container at run-time and for Amsterdam tailored e2e tests.

Each separate package will still have their own `Dockerfile`.

### Deployment

A single `Jenkinsfile` in [Amsterdam/signalen](https://github.com/Amsterdam/signalen) will tie `signals-frontend` and the separate packages together. This will prevent having race conditions.

A merge into the `develop` branch of the `signals-frontend` repository will trigger a build in the [Amsterdam/signalen](https://github.com/Amsterdam/signalen). That also goes for a merge into the `develop` branch of `Amsterdam/signalen`. A merge into the `master` branch of any of the repositories will __NOT__ trigger a build.

A job will be canceled whenever schema validation fails. As early as possible.

The `Amsterdam/signalen` Jenkins job will be a parameterized job where both an [Amsterdam/signalen](https://github.com/Amsterdam/signalen) tag and [signals-frontend](https://github.com/Amsterdam/signals-frontend) tag can be set for deployment. By default the latest tags should be set. Selecting tags instead of deploying from the `master` branch will allow for rollbacks, whenever necessary.

## Consequences

The proposed transformation will make it easier to create another application in the future, if necessary. It will also reduce complexity and margin for error compared to the current setup.
