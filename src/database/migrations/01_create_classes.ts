import Knex from "knex";

export async function up(knex: Knex) {
  await knex.schema.createTable("classes", (table) => {
    table.increments("id").primary(),
      table.string("subject").notNullable(),
      table.string("link").notNullable(),

      table.integer('user_id')
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable("classes");
}
