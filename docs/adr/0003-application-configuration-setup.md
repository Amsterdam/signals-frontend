# Application configuration setup

Date: 2020-05-07

## Status

Accepted

## Context

Up to the point of writing this ADR, the SIA application aims to service only the municipality of Amsterdam. However, because of the nature of the application, more municipalities have shown an interest in the functionality the application has to offer.

This poses a challenge, because there is a lot in the application that is specific to the municipality of Amsterdam. To sum up, amongst others (in random order):

- Docker registry URLs
- URLs of API endpoints, machine learning service, Authz service and map server
- Nginx configuration
- HTML `<title />`
- [`Sentry` Package](https://www.npmjs.com/package/@sentry/browser) dependency and configuration
- PWA manifest
- Logo
- Favicon
- PWA icons
- Hardcoded strings
- Main menu items
- Theme configuration
- Maps settings
- [`amsterdam-stijl` Package](https://www.npmjs.com/package/amsterdam-stijl) Package dependency
- Package URL and description

All of the above need to be configurable or should be taken out of the equation to be able to publish a white-label version of `signals-frontend`.

## Considerations

In the near future (at the time of writing), the client wants both meldingen.weesp.nl and meldingen.amsterdamsebos.nl to make use of the same functionality as is currently available at [meldingen.amsterdam.nl](https://meldingen.amsterdam.nl). Both applications need to be branded and have settings that are specific to the Weesp and Amsterdamse Bos brands.

None of the mentioned settings can or should yet be maintainable by means of a CMS. Till that moment comes, everything listed can be considered 'static'.

## Options

To be able to deploy a branded version of the white-label application, we have several options at our disposal. The most notable are:

### Client-side

All brand specific variables are retrieved on the client-side by means of an XHR request. The entire application should wait until those settings have been retrieved.

**Pros**

- Makes it possible to have all settings maintainable via a (headless) CMS

**Cons**

- Render blocking request
- Database as well as endpoint setup and maintenance required
- API URLs need to be provided separately so that each application instance can have its own API
- Differs from current configuration setup and requires refactoring of the configuration service

### Server-side / container

All variables are injected into the application at build-time through environment variables or static JSON data.

**Pros**

- No render-blocking XHR request required
- No database or endpoint setup and maintenance required
- Each application instance can be deployed with the settings it needs
- The architecture of the application doesn't notably change

**Cons**

- Changes in variable values can only be applied by deploying the application

## Decision

Taking the pros and cons, the application's architecture, the Datapunt infrastructure and upcoming client wishes into account, the decision is made to go for the [Server-side / container](#Server-side / container) option.

The repository will contain default configuration options so that it can be run locally and still be deployed to (acc.)meldingen.amsterdam.nl without the application breaking.

Configuration is injected in the `index.html` file so it can be read at run-time.
