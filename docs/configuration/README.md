# Configuration

The application's configuration is provided by [`environment.conf.json`](../../environment.conf.json). That file contains default values that will allow you to run the application locally and to be able to deploy a Netlify build.

Instance specific configuration is, at the time of writing, provided by [`signals-amsterdam`](https://github.com/Amsterdam/signals-amsterdam) and [`signals-weesp`](https://github.com/Amsterdam/signals-weesp). During Docker build, the correct configuration is [mounted into the container](../../Dockerfile#L72).<br />
See [the `Dockerfile` in the `signals-amsterdam` repository](https://github.com/Amsterdam/signals-amsterdam/blob/develop/Dockerfile#L5).

## Properties

Properties and their descriptions are defined in [mounted into the container](../../internals/schemas/environment.conf.schema.json).
