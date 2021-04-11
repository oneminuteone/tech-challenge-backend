import { script } from '@hapi/lab'
import { expect } from '@hapi/code'
import sinon from 'sinon'

export const lab = script()
const { beforeEach, before, after, afterEach, describe, it } = lab

import { list, find, findMovieList, findFavouriteGenre, findCharacterNames, remove, create, update } from './actors'
import { knex } from '../util/knex'
import * as movies from '../lib/movies'
import * as genres from '../lib/genres'

describe('lib', () => describe('actor', () => {
  const sandbox = Object.freeze(sinon.createSandbox())

  const isContext = (value: unknown): value is Context => {
    if(!value || typeof value !== 'object') return false
    const safe = value as Partial<Context>
    if(!safe.stub) return false
    return true
  }
  interface Context {
    stub: Record<string, sinon.SinonStub>
  }
  interface Flags extends script.Flags {
    readonly context: Partial<Context>
  }

  before(({context}: Flags) => {
    context.stub = {
      knex_from: sandbox.stub(knex, 'from'),
      knex_select: sandbox.stub(knex, 'select'),
      knex_where: sandbox.stub(knex, 'where'),
      knex_first: sandbox.stub(knex, 'first'),
      knex_join: sandbox.stub(knex, 'join'),
      knex_raw: sandbox.stub(knex, 'raw'),
      knex_group_by: sandbox.stub(knex, 'groupBy'),
      knex_order_by: sandbox.stub(knex, 'orderBy'),
      knex_pluck: sandbox.stub(knex, 'pluck'),
      knex_delete: sandbox.stub(knex, 'delete'),
      knex_into: sandbox.stub(knex, 'into'),
      knex_insert: sandbox.stub(knex, 'insert'),
      knex_update: sandbox.stub(knex, 'update'),
      movies_findByIds: sandbox.stub(movies, 'findByIds'),
      genres_find: sandbox.stub(genres, 'find'),
      console: sandbox.stub(console, 'error'),
    }
  })

  beforeEach(({context}: Flags) => {
    if(!isContext(context)) throw TypeError()

    context.stub.knex_from.returnsThis()
    context.stub.knex_select.returnsThis()
    context.stub.knex_where.returnsThis()
    context.stub.knex_first.returnsThis()
    context.stub.knex_into.returnsThis()
    context.stub.knex_pluck.returnsThis()
    context.stub.knex_join.returnsThis()
    context.stub.knex_raw.returnsThis()
    context.stub.knex_group_by.returnsThis()
    context.stub.knex_order_by.returnsThis()
    context.stub.movies_findByIds.returnsThis()
    context.stub.genres_find.returnsThis()
    context.stub.knex_delete.rejects(new Error('test: expectation not provided'))
    context.stub.knex_insert.rejects(new Error('test: expectation not provided'))
    context.stub.knex_update.rejects(new Error('test: expectation not provided'))
  })

  afterEach(() => sandbox.resetHistory())
  after(() => sandbox.restore())

  describe('list', () => {

    it('returns rows from table `actor`', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()

      await list()
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'actor')
      sinon.assert.calledOnce(context.stub.knex_select)
    })

  })

  describe('find', () => {

    it('returns one row from table `actor`, by `id`', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()
      const anyId = 123

      await find(anyId)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'actor')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
      sinon.assert.calledOnce(context.stub.knex_first)
    })

  })

  describe('findMovieList', () => {

    it('returns findMovieList view by actor `id`', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()
      const anyId = 123

      await findMovieList(anyId)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'movieCharacter')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { actor_id: anyId })
      sinon.assert.calledOnce(context.stub.movies_findByIds)
    })

  })

  describe('findFavouriteGenre', () => {

    it('returns findFavouriteGenre view by actor `id`', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()
      const anyId = 123

      await findFavouriteGenre(anyId)
      sinon.assert.calledTwice(context.stub.knex_from)
      sinon.assert.calledWithExactly(context.stub.knex_from.getCall(0), 'movie')
      sinon.assert.calledWithExactly(context.stub.knex_from.getCall(1), 'movie')
      sinon.assert.calledOnceWithExactly(context.stub.knex_join,'movieCharacter', 'movie.id', 'movieCharacter.movie_id')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { actor_id: anyId })
      sinon.assert.calledOnceWithExactly(context.stub.knex_select, knex.raw('genre_id, count("id") as total'))
      sinon.assert.calledOnceWithExactly(context.stub.knex_group_by, 'genre_id')
      sinon.assert.calledOnceWithExactly(context.stub.knex_order_by, 'total', 'desc')
      sinon.assert.calledOnce(context.stub.genres_find)
    })

  })

  describe('findCharacterNames', () => {

    it('returns findCharacterNames view from table `movieCharacter`, by actor `id`', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()
      const anyId = 123

      await findCharacterNames(anyId)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'movieCharacter')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { actor_id: anyId })
      sinon.assert.calledOnceWithExactly(context.stub.knex_select, 'name')
    })

  })


  describe('remove', () => {

    it('removes one row from table `actor`, by `id`', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()
      const anyId = 123
      context.stub.knex_delete.resolves()

      await remove(anyId)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'actor')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
      sinon.assert.calledOnce(context.stub.knex_delete)
    })

    ; [0, 1].forEach( rows =>
      it(`returns ${!!rows} when (${rows}) row is found and deleted`, async ({context}: Flags) => {
        if(!isContext(context)) throw TypeError()
        context.stub.knex_delete.resolves(rows)
        const anyId = 123

        const result = await remove(anyId)
        expect(result).to.be.boolean()
        expect(result).equals(!!rows)
      }))

  })

  describe('update', () => {

    it('updates one row from table `actor`, by `id`', async ({context}: Flags) => {
      const anyId = 123
      if(!isContext(context)) throw TypeError()
      const anyActor = {
        name: 'John',
        bio: 'Some bio',
        bornAt: new Date('1942-07-02')
      }
      context.stub.knex_update.resolves()

      await update(anyId, anyActor)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'actor')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
      sinon.assert.calledOnceWithExactly(context.stub.knex_update, anyActor)
    })

    ; [0, 1].forEach( rows =>
      it(`returns ${!!rows} when (${rows}) row is found and deleted`, async ({context}: Flags) => {
        if(!isContext(context)) throw TypeError()
        const anyId = 123
        const anyActor = {
          name: 'John',
          bio: 'Some bio',
          bornAt: new Date('1942-07-02')
        }
        context.stub.knex_update.resolves(rows)

        const result = await update(anyId, anyActor)
        expect(result).to.be.boolean()
        expect(result).equals(!!rows)
      }))

  })

  describe('remove', () => {

    it('removes one row from table `actor`, by `id`', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()
      const anyId = 123
      context.stub.knex_delete.resolves()

      await remove(anyId)
      sinon.assert.calledOnceWithExactly(context.stub.knex_from, 'actor')
      sinon.assert.calledOnceWithExactly(context.stub.knex_where, { id: anyId })
      sinon.assert.calledOnce(context.stub.knex_delete)
    })

    ; [0, 1].forEach( rows =>
      it(`returns ${!!rows} when (${rows}) row is found and deleted`, async ({context}: Flags) => {
        if(!isContext(context)) throw TypeError()
        context.stub.knex_delete.resolves(rows)
        const anyId = 123

        const result = await remove(anyId)
        expect(result).to.be.boolean()
        expect(result).equals(!!rows)
      }))

  })

  describe('create', () => {

    it('insert one row into table `actor`', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()
      const anyActor = {
        name: 'John',
        bio: 'Some bio',
        bornAt: new Date('1942-07-02')
      }
      context.stub.knex_insert.resolves([])

      await create(anyActor)
      sinon.assert.calledOnceWithExactly(context.stub.knex_into, 'actor')
      sinon.assert.calledOnceWithExactly(context.stub.knex_insert, anyActor)
    })

    it('returns the `id` created for the new row', async ({context}: Flags) => {
      if(!isContext(context)) throw TypeError()
      const anyActor = {
        name: 'John',
        bio: 'Some bio',
        bornAt: new Date('1942-07-02')
      }
      const anyId = 123
      context.stub.knex_insert.resolves([anyId])

      const result = await create(anyActor)
      expect(result).to.be.number()
      expect(result).equals(anyId)
    })

  })

}))
