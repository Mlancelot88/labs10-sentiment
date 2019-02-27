exports.up = function(knex, Promise) {
  return knex.schema.createTable("surveys", tbl => {
    tbl.increments("id");
    tbl.string("title", 255).notNullable();
    tbl.string("description", 255).notNullable();
    tbl.timestamp("created_at", true).defaultTo(knex.fn.now());
    tbl.integer("manager_id").notNullable();
    tbl.float("survey_time_stamp");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("surveys");
};
