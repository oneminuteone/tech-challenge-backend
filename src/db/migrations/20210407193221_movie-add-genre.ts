import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('movie', function(t) {
    t.integer('genre_id').unsigned().defaultTo(1)
    t.foreign('genre_id').references('id').inTable('genre')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('movie', function(t) {
    t.dropForeign(['genre_id'])
    t.dropColumn('genre_id')
  })
}
