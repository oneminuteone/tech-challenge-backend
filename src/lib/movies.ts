import { knex } from '../util/knex'

export interface PayloadMovie {
  name: string
  synopsis?: string
  releasedAt: Date
  runtime: number
  genre_id: number
}

export interface Movie extends PayloadMovie {
  id: number
}

export function list(): Promise<Movie[]> {
  return knex.from('movie').select()
}

export function find(id: number): Promise<Movie> {
  return knex.from('movie').where({ id }).first()
}

/** @returns Movie Records with the IDs passed as argument*/
export function findByIds(movieIds: number[]): Promise<Movie[]> {
  return knex.from('movie').whereIn('id', movieIds)
}

/** @returns whether the ID was actually found */
export async function remove(id: number): Promise<boolean> {
  const count = await knex.from('movie').where({ id }).delete()
  return count > 0
}

/** @returns the ID that was created */
export async function create(payload: PayloadMovie): Promise<number> {
  const [ id ] = await (knex.into('movie').insert(payload))
  return id
}

/** @returns whether the ID was actually found */
export async function update(id: number, payload: Partial<PayloadMovie>): Promise<boolean>  {
  const count = await knex.from('movie').where({ id }).update(payload)
  return count > 0
}
