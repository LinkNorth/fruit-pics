const config = require('./knexfile.js').development;
const knex = require('knex')(config);

module.exports = knex;
