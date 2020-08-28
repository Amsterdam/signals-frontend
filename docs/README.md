# Documentation

## Architectural decision records

All important architectural decisions that have been made, along with their context and consequences, are documented [here](./adr/README.md).
See https://github.com/joelparkerhenderson/architecture_decision_record for reference on creating ADRs.

## Schemas

### Configuration schema

The application is split into multiple parts where the functionality lives in this repository and the corresponding configuration in another. Each configuration property is listed and described [here](./schemas/README.md).

## Setting up a serviceworker proxy

It can sometimes be useful to mock requests in the browser in order to test different UI presentations. For instance when a user's permission should dictate which menu items should be shown.

This behaviour can be accomplished by invoking a serviceworker that acts as a proxy that can return specific content for certain requests.

The [serviceworker](../src/sw-proxy.js) takes [an array of request/response configurations](../src/sw-proxy-config.js). A config object can have the following properties:

- `request`: Object (required)
- `request.headers`: Object (optional), key/value pairs of HTTP headers
- `request.method`: String (required), HTTP method (GET, POST, PUT or DELETE)
- `request.url`: String (required), fully qualified URL of the request to be proxied. Can be a regexp.

- `response`: Object (required)
- `response.body`: Object/String (optional): response body
- `response.file`: String (optional), path to file to be served, relative to root folder of the application. Must be accessible to the web server and will be ignored if `body` is present
- `response.headers`: Object (optional), key/value pairs of HTTP headers
- `response.status`: Number (optional), HTTP status code
- `response.statusText`: String (optional), HTTP status text

To run the application with the proxied serviceworker:

```
HTTPS=true PROXY=true npm start
```

After each change of the [array of request/response configurations](../src/sw-proxy-config.js), the serviceworker doens't automatically pick up the changes. A hard refresh or clearing the application's data in the browser will fix that.
