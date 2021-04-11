import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE movieCharacter (
      id  INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      name  VARCHAR(100) NOT NULL,
      actor_id INT(10) UNSIGNED NOT NULL,
      movie_id INT(10) UNSIGNED NOT NULL,

      CONSTRAINT PK_character__id PRIMARY KEY (id),
      CONSTRAINT UK_character__record UNIQUE KEY (name, movie_id, actor_id),
      CONSTRAINT FK_actor FOREIGN KEY (actor_id) REFERENCES actor(id) ON DELETE CASCADE,
      CONSTRAINT FK_movie FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE
  );`)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TABLE movieCharacter;')
}
