# Setting up a serviceworker Proxy

The [serviceworker](../src/sw-proxy.js) takes [an array of request/response configurations](../src/sw-proxy-config.js). A config object can have the following properties:

- `request`: Object (required)
- `request.headers`: Object (optional), key/value pairs of HTTP headers
- `request.method`: String (required), HTTP method (GET, POST, PUT or DELETE)
- `request.url`: String (required), fully qualified URL of the request to be proxied. Can be a regexp.

- `response`: Object (required)
- `response.body`: Object/String (optional): response body
- `response.delay`: Number (optional): delay in milliseconds for the response to return
- `response.file`: String (optional), path to file to be served, relative to root folder of the application. Must be accessible to the web server and will be ignored if `body` is present
- `response.headers`: Object (optional), key/value pairs of HTTP headers
- `response.status`: Number (optional), HTTP status code
- `response.statusText`: String (optional), HTTP status text

To run the application with the proxied serviceworker:

```
HTTPS=true PROXY=true npm start
```

After each change of the [array of request/response configurations](../src/sw-proxy-config.js), the serviceworker doens't automatically pick up the changes. A hard refresh or clearing the application's data in the browser will fix that.
