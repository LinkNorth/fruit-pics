
exports.up = function(knex) {
  return knex.schema.createTable('users_followers', t => {
    t.bigInteger('follower_id').notNullable().references('users.id');
    t.bigInteger('following_id').notNullable().references('users.id');
    t.unique(['follower_id', 'following_id']);
    t.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_followers');
};
