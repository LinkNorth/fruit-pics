
exports.up = function(knex) {
  return knex.schema.table('users_images', t => {
    t.text('description');
    t.text('title');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users_images', t => {
    t.dropColumn('description');
    t.dropColumn('title');
  });
};
