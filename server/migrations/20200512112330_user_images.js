
exports.up = function(knex) {
  return knex.schema.createTable('users_images', t => {
    t.bigInteger('user_id').notNullable().references('users.id');
    t.string('image_id').notNullable();
    t.unique(['user_id', 'image_id']);
    t.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_images');
};
