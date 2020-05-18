
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('comments', t => {
      t.increments();
      t.string('image_id').notNullable();
      t.bigInteger('user_id').references('users.id').notNullable();
      t.text('comment').notNullable();
      t.timestamps(true, true);
    }),
    knex.schema.createTable('likes', t => {
      t.increments();
      t.string('image_id').notNullable();
      t.bigInteger('user_id').references('users.id').notNullable();
      t.timestamps(true, true);
      t.unique(['image_id', 'user_id']);
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('comments'),
    knex.schema.dropTable('likes'),
  ])
};
