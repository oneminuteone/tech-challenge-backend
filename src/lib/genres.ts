import { knex } from '../util/knex'

export interface Genre {
  id: number
  name: string
}

export interface GenreCount {
  name: string
  total: number
}

export interface ActorsCount {
  name: string
  appearances: number
}

export function list(): Promise<Genre[]> {
  return knex.from('genre').select()
}

export function find(id: number): Promise<Genre> {
  return knex.from('genre').where({ id }).first()
}

/** @returns list of actor name and number of appearences by Genre sorted by most appearances*/
export async function actorsInGenre(id: number): Promise<ActorsCount[]> {
  const actorsCount = await knex
    .select(knex.raw('actor.name, count("actor_id") as appearances'))
    .from('movie')
    .join('movieCharacter', 'movie.id', 'movieCharacter.movie_id')
    .join('genre', 'genre.id', 'movie.genre_id')
    .join('actor', 'actor.id', 'movieCharacter.actor_id')
    .where({ genre_id: id })
    .from('movie').groupBy('actor_id').orderBy('appearances', 'desc') as ActorsCount[]
  return actorsCount
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from('genre').where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(name: string): Promise<number> {
  const [ id ] = await (knex.into('genre').insert({ name }))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, name: string): Promise<boolean>  {
  const count = await knex.from('genre').where({ id }).update({ name })
  return count > 0
}
