import Knex from "knex";

export async function up(knex: Knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary(),
      table.string("name").notNullable(),
      table.string("avatar").notNullable(),
      table.string("whatsapp").notNullable(),
      table.string("des").notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable("users");
}
