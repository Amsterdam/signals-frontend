# Move images to webroot

Date: 2022-01-25

## Status

Accepted

## Context

SVG images are used throughout the application, both in the public incident form as well as in the backoffice part of the web application. Most of the SVGs have been inlined as text and are referenced by URL in the production bundle. Because the `signals-frontend` application needs to serve more than one tenant (see [Multi-tenant architecture](./0004-multi-tenant-architecture.md)) it makes sense to be able to overwrite images at the client level and have, for instance, [the municipality of Den Bosch](https://meldingen.s-hertogenbosch.nl/incident/beschrijf) provide its own images for different types of trash containers.

Different image contents can be set by the Django admin and are applied when the feature flag `fetchQuestionsFromBackend` (see [app.schema.json](../../internals/schemas/app.schema.json)) has been set. Because, only in that case, questions configuration is retrieved from the API and can overwrite any images that have been configured.

The downside of having images as text, is that all of the available SVG images are at all times present in the `signals-frontend` production bundle which will unnessarily increase the size of the bundle. Also, images cannot be cached by the browser and cannot be preloaded (if that would be required).

Being able to maintain the different images by means of a CMS -in our case Django- is not required since images hardly ever change and only have to be provided once when the application is deployed for the first time. With the correct Dockerfile, assets can be overwritten at build time. See for instance [the Dockerfile for the Weesp domain](https://github.com/Amsterdam/signalen/blob/develop/domains/weesp/Dockerfile).


To summarize, Moving the SVG images to the application's web root will allow us to:
- decrease the production bundle size
- have images cached by the browser
- reduce complexity in the code, because images can be referenced by URL instead of having to import them and then convert that import to a string
- overwrite images at the Docker container level

## Decision

SVG images that can be referenced by URL will be moved to the web root. Putting them in the `/assets/images` folder will do. In time, when images need to be optimized, we can store them in a different folder and copy them at build-time to the web root and at the same time optimize the image content.
