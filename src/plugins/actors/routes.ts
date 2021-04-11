import {
  ServerRoute,
  ResponseToolkit,
  Lifecycle,
  RouteOptionsValidate,
  Request,
  RouteOptionsResponseSchema
} from '@hapi/hapi'
import joi from 'joi'
import Boom from '@hapi/boom'

import * as actors from '../../lib/actors'

import { isHasCode } from '../../util/types'


interface ParamsId {
  id: number
}
const validateParamsId: RouteOptionsValidate = {
  params: joi.object({
    id: joi.number().required().min(1),
  })
}

const validatePayloadActor: RouteOptionsResponseSchema = {
  payload: joi.object({
    name: joi.string().required(),
    bio: joi.string().required(),
    bornAt: joi.date().required(),
  })
}

const validateUpdatePayloadActor: RouteOptionsResponseSchema = {
  payload: joi.object({
    name: joi.string(),
    bio: joi.string(),
    bornAt: joi.date(),
  })
}


export const actorRoutes: ServerRoute[] = [{
  method: 'GET',
  path: '/actors',
  handler: getAll,
},{
  method: 'POST',
  path: '/actors',
  handler: post,
  options: { validate: validatePayloadActor },
},{
  method: 'GET',
  path: '/actors/{id}/movieList',
  handler: getActorMovieList,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actors/{id}/favouriteGenre',
  handler: getActorFavouriteGenre,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actors/{id}/characterNames',
  handler: getActorCharacterNames,
  options: { validate: validateParamsId },
},{
  method: 'GET',
  path: '/actors/{id}',
  handler: get,
  options: { validate: validateParamsId },
},{
  method: 'PUT',
  path: '/actors/{id}',
  handler: put,
  options: { validate: {...validateParamsId, ...validateUpdatePayloadActor} },
},{
  method: 'DELETE',
  path: '/actors/{id}',
  handler: remove,
  options: { validate: validateParamsId },
},]


async function getAll(_req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  return actors.list()
}

async function getActorMovieList(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)
  const actorFound = await actors.find(id)
  if(!actorFound) { return Boom.notFound() }

  const found = await actors.findMovieList(id)
  return found || Boom.notFound()
}

async function getActorFavouriteGenre(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)
  const actorFound = await actors.find(id)
  if(!actorFound) { return Boom.notFound() }

  const found = await actors.findFavouriteGenre(id)
  return found || Boom.notFound()
}

async function getActorCharacterNames(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)
  const actorFound = await actors.find(id)
  if(!actorFound) { return Boom.notFound() }

  const found = await actors.findCharacterNames(id)
  return found || Boom.notFound()
}

async function get(req: Request, _h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  const found = await actors.find(id)
  return found || Boom.notFound()
}

async function post(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  try {
    const id = await actors.create(req.payload as actors.PayloadActor)
    const result = {
      id,
      path: `${req.route.path}/${id}`
    }
    return h.response(result).code(201)
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}


async function put(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  try {
    return await actors.update(id, req.payload as Partial<actors.PayloadActor>) ? h.response().code(204) : Boom.notFound()
  }
  catch(er: unknown){
    if(!isHasCode(er) || er.code !== 'ER_DUP_ENTRY') throw er
    return Boom.conflict()
  }
}

async function remove(req: Request, h: ResponseToolkit, _err?: Error): Promise<Lifecycle.ReturnValue> {
  const { id } = (req.params as ParamsId)

  return await actors.remove(id) ? h.response().code(204) : Boom.notFound()
}
