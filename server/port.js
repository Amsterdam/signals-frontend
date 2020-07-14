const argv = require('./argv');

module.exports = Number.parseInt(argv.port || process.env.PORT || '3000', 10);
