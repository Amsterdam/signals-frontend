
# SIA - Signalen Informatievoorziening Amsterdam

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

## Installation

  -  npm install

## Configure IPs

Depending of how many api / auth / maps / components you have running configure the ip addresses in:

  - environment.conf.json

## Development

  - npm start
  - The SPA will open at http://localhost:3001/

## Testing

  - npm run test

## Thanks to
<a href="http://browserstack.com/"><img src="src/images/browserstack-logo-600x315.png" height="130" alt="BrowserStack Logo" /></a>
