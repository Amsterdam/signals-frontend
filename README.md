
# SIA - Signalen Informatievoorziening Amsterdam (base repository)

This project is based on the react boilerplate that was adapted for the needs of the municipality of Amsterdam.
See https://github.com/Amsterdam/react-boilerplate.git for more information on the react boilerplate

## Requirements

  -  npm >= 6.11
  -  node >= v10.16 < v12.0

This project relies on the[ `leaflet-headless`](https://www.npmjs.com/package/leaflet-headless) package. On OSX, you'll need to have [`cairo`](https://formulae.brew.sh/formula/cairo), [`pango`](https://formulae.brew.sh/formula/pango) and [`cmake`](https://formulae.brew.sh/formula/cmake) installed.

## Node versions

If you are running Node 12 or later you could use *nvm* (we need an older version of Node until we upgrade leaflet)

Install *nvm* from source or with your preferred package manager.

Modify your shell startup file and add the following line to load the *nvm* script when you login:

    source /usr/share/nvm/init-nvm.sh

Install a specific node version with *nvm* and make it the active node version:

    nvm install 11.15.0
    nvm use 11.15.0

If you would like to use your system *Node* version as default, you could alias it to the default🐚

    nvm alias default system

To specify the Node version for your project you could create an **.nvmrc** file, for example:

    echo 11.15.0 > ~/projects/signals-frontend/.nvmrc
    npm start

## Installation

  -  npm install

## Configure IPs

Depending of how many api / auth / maps / components you have running configure the ip addresses in:

  - environment.conf.json

## Development

The SPA will run over HTTP on `localhost` at port `3001`. The port can be configured by setting the environment variable `PORT`.

    npm start

    PORT=8000 npm start

Do note that the application uses an external authentication service that does not accept any port. The whitelisted ports are `3000` and `3001`

### HTTPS

The application's production build uses a [serviceworker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) that is configured through the Webpack Offline plugin (see [webpack config](./internals/webpack/webpack.prod.babel.js)) and is installed in [app.js](./src/app.js).

To run the application with the production code and have the serviceworker available, the site needs to be run over HTTPS. This can be accomplished by running

    HTTPS=true npm run start:prod

## Testing

By default, the unit test generates a coverage report (thresholds are set in [jest.config.js](./jest.config.js)).

Running all tests and generate the coverage report:

    npm test

## Thanks to
<a href="http://browserstack.com/"><img src="src/images/browserstack-logo-600x315.png" height="130" alt="BrowserStack Logo" /></a>
