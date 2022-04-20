exports.up = function (knex) {
  return knex.schema.createTable("abouts", function (table) {
    // Primary Key
    table.string("id", 36);
    table.string("name", 100);
    table.longtext("description");
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("abouts");
};
