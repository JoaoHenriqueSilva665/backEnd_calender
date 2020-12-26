import Knex from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('favorites', table =>{
    table.increments('id').primary()

    table
      .integer('favorite_user_id')
      .notNullable()
      .references('id')
      .inTable('classes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

export async function down(knex:Knex) {
  await knex.schema.dropTable('favorites')
}