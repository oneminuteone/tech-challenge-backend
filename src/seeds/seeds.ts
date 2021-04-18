import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
// Deletes ALL existing entries
  await knex('actor').del()

  // Inserts seed entries
  await knex('actor').insert([
    {
      id: 1,
      name: 'Jack Nicholson',
      bio: 'Jack Nicholson, an American actor, producer, director and screenwriter, is a three-time Academy Award winner and twelve-time nominee.',
      bornAt: '1937-04-22'
    },
    {
      id: 2,
      name: 'Robert De Niro',
      bio: 'One of the greatest actors of all time, Robert De Niro was born on August 17, 1943 in Manhattan, New York City, to artists Virginia (Admiral) and Robert De Niro Sr',
      bornAt: '1943-08-17',
    },
    {
      id: 3,
      name: 'Al Pacino',
      bio: 'Alfredo James "Al" Pacino established himself as a film actor during one of cinema\'s most vibrant decades, the 1970s, and has become an enduring and iconic figure in the world of American movies.',
      bornAt: '1940-04-25',
    },
  ])

  // Deletes ALL existing genres
  await knex('genre').del()

  // Inserts seed genres
  await knex('genre').insert([
    { id: 1, name: 'Action' },
    { id: 2, name: 'Thriller' },
    { id: 3, name: 'Drama' }
  ])

  await knex('movie').del()

  // Inserts seed movies
  await knex('movie').insert([
    {
      id: 1,
      name: 'The Godfather',
      synopsis: 'An organized crime dynasty\'s aging patriarch transfers control of his clandestine empire to his reluctant son.',
      releasedAt: '1976-10-24',
      runtime: 175 ,
      genre_id: 3
    },
    {
      id: 2,
      name: 'The Dark Knight',
      synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      releasedAt: '2008-07-24',
      runtime: 152,
      genre_id: 1
    },
    {
      id: 3,
      name: 'Joker',
      releasedAt: '2019-08-31',
      runtime: 122,
      genre_id: 3
    },
    {
      id: 4,
      name: 'Some random movie',
      synopsis: 'Random description 123',
      releasedAt: '2003-04-12',
      runtime: 123,
      genre_id: 2
    },
  ])

  await knex('movieCharacter').del()

  // Inserts seed movie characters
  await knex('movieCharacter').insert([
    {
      id: 1,
      name: 'Joker',
      actor_id:1,
      movie_id: 1,
    },
    {
      id: 2,
      name: 'Al Capone',
      actor_id:1,
      movie_id: 3,
    },
    {
      id: 3,
      name: 'El Tigre',
      actor_id:1,
      movie_id: 4,
    },
    {
      id: 4,
      name: 'Batman',
      actor_id:1,
      movie_id: 2,
    },
    {
      id: 5,
      name: 'Joker',
      actor_id: 2,
      movie_id: 1,
    },
    {
      id: 6,
      name: 'Joker',
      actor_id: 2,
      movie_id: 2,
    },
  ])
}
