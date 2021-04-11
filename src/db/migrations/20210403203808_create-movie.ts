import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE movie (
      id  INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name  VARCHAR(100) NOT NULL,
      synopsis  VARCHAR(200),
      releasedAt  DATE NOT NULL,
      runtime INT(4) UNSIGNED NOT NULL,

      CONSTRAINT PK_movie__id PRIMARY KEY (id),
      CONSTRAINT UK_movie__record UNIQUE KEY (name, synopsis, releasedAt, runtime)
  );`)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE movie;')
}
