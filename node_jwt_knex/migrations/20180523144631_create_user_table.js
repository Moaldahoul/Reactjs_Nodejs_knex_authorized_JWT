
exports.up = function(knex, Promise) {
  return knex.schema.createTable('login_user', t =>{
      t.increments('id').unsigned().primary();
      t.string('email').NOTNull();
      t.string('password_digest').NOTNull();
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('login_user');
};
