import { knex } from '../util/knex'

import * as movies from './movies'
import * as genres from './genres'

export interface PayloadActor {
  name: string
  bio: string
  bornAt: Date
}

export interface Actor extends PayloadActor {
  id: number
}

export function list(): Promise<Actor[]> {
  return knex.from('actor').select()
}

export function find(id: number): Promise<Actor> {
  return knex.from('actor').where({ id }).first()
}

/** @returns the list of Movies where actor with given ID stars*/
export async function findMovieList(id: number): Promise<movies.Movie[]> {
  const movieIds: number[] = await knex.from('movieCharacter').where({ actor_id: id }).pluck('movie_id')
  return await movies.findByIds(movieIds)
}

/** @returns the favourite Genre for actor with given ID  */
export async function findFavouriteGenre(id: number): Promise<genres.Genre| []> {
  const favouriteGenreId: number[] = await knex.from('movie')
    .join('movieCharacter', 'movie.id', 'movieCharacter.movie_id')
    .where({ actor_id: id })
    .select(knex.raw('genre_id, count("id") as total'))
    .from('movie').groupBy('genre_id').orderBy('total', 'desc')
    .first().pluck('genre_id')

  return await genres.find(favouriteGenreId[0] || -1)
}

/** @returns the character names for actor with given ID  */
export function findCharacterNames(id: number): Promise<string[]> {
  return knex.from('movieCharacter').where({actor_id: id }).select('name')
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from('actor').where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(payload: PayloadActor): Promise<number> {
  const [ id ] = await (knex.into('actor').insert(payload))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, payload: Partial<PayloadActor>): Promise<boolean>  {
  const count = await knex.from('actor').where({ id }).update(payload)
  return count > 0
}
