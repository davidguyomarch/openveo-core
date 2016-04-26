'use strict';

/**
 * @module core-controllers
 */

/**
 * Provides route actions for all CRUD (Create Read Update Delete)
 * operations on entities.
 * When an entity is defined by the core or a plugin, 5 routes will be
 * automatically handled by the crudController.
 * - A route to get one entity
 * - A route to get a list of entities
 * - A route to add an entity
 * - A route to update an entity
 * - A route to delete an entity
 *
 * @class crudController
 */

var openVeoAPI = require('@openveo/api');
var errors = process.require('app/server/httpErrors.js');
var AccessError = openVeoAPI.errors.AccessError;

/**
 * Gets entity model.
 *
 * @method getEntityModel
 * @private
 * @static
 * @param {String} type The type of entity
 * @param {Object} user Authenticated user
 * @return {EntityModel} An instance of an EntityModel or null if not found
 */
function getEntityModel(type, user) {
  var entities = openVeoAPI.applicationStorage.getEntities();

  if (entities[type])
    return new entities[type](user);
  else
    return null;
}

/**
 * Gets a list of entities.
 *
 * Expects the following url parameters :
 *  - **type** The type of entities to retrieve
 *
 * @example
 *     {
 *       "entities" : [ ... ]
 *     }
 *
 * @method getEntitiesAction
 * @static
 */
module.exports.getEntitiesAction = function(request, response, next) {
  if (request.params.type) {
    var model = getEntityModel(request.params.type, request.user);

    if (model) {
      model.get(null, function(error, entities) {
        if (error) {
          next((error instanceof AccessError) ? errors.GET_ENTITIES_FORBIDDEN : errors.GET_ENTITIES_ERROR);
        } else {
          response.send({
            entities: entities
          });
        }
      });
    } else {

      // No model implemented for this type of entity
      next(errors.GET_ENTITIES_UNKNOWN);

    }
  } else {

    // Missing the type of entities
    next(errors.GET_ENTITIES_MISSING_PARAMETERS);

  }
};

/**
 * Gets a specific entity.
 *
 * Expects the following url parameters :
 *  - **type** The type of the entity to retrieve
 *  - **id** The id of the entity to retrieve
 *
 * @example
 *     {
 *       "entity" : { ... }
 *     }
 *
 * @method getEntityAction
 * @static
 */
module.exports.getEntityAction = function(request, response, next) {
  if (request.params.type && request.params.id) {
    var model = getEntityModel(request.params.type, request.user);

    if (model) {
      model.getOne(request.params.id, null, function(error, entity) {
        if (error) {
          next((error instanceof AccessError) ? errors.GET_ENTITY_FORBIDDEN : errors.GET_ENTITY_ERROR);
        } else {
          response.send({
            entity: entity
          });
        }
      });
    } else {

      // No model implemented for this type of entity
      next(errors.GET_ENTITY_UNKNOWN);

    }
  } else {

    // Missing type and / or id of the entity
    next(errors.GET_ENTITY_MISSING_PARAMETERS);

  }
};

/**
 * Updates an entity.
 *
 * Expects the following url parameters :
 *  - **type** The type of the entity to retrieve
 *  - **id** The id of the entity to update
 *
 * Also expects data in body.
 *
 * @method updateEntityAction
 * @static
 */
module.exports.updateEntityAction = function(request, response, next) {
  if (request.params.type && request.params.id && request.body) {
    var model = getEntityModel(request.params.type, request.user);

    if (model) {
      model.update(request.params.id, request.body, function(error, stack) {
        if (error && (error instanceof AccessError))
          next(errors.UPDATE_ENTITY_FORBIDDEN);
        else if (error || (stack && stack.result && stack.result.ok === 0)) {
          next(errors.UPDATE_ENTITY_ERROR);
        } else {
          response.send({error: null, status: 'ok'});
        }
      });
    } else {

      // No model implemented for this type of entity
      next(errors.UPDATE_ENTITY_UNKNOWN);

    }
  } else {

    // Missing type and / or id of the entity
    next(errors.UPDATE_ENTITY_MISSING_PARAMETERS);

  }
};

/**
 * Adds an entity.
 *
 * Expects the following url parameters :
 *  - **type** The type of the entity to add
 *
 * Also expects entity data in body.
 *
 * @method addEntityAction
 * @static
 */
module.exports.addEntityAction = function(request, response, next) {
  if (request.params.type && request.body) {
    var model = getEntityModel(request.params.type, request.user);

    if (model) {
      model.add(request.body, function(error, entity) {
        if (error) {
          next((error instanceof AccessError) ? errors.ADD_ENTITY_FORBIDDEN : errors.ADD_ENTITY_ERROR);
        } else {
          response.send({
            entity: entity
          });
        }
      });
    } else {

      // No model implemented for this type of entity
      next(errors.ADD_ENTITY_UNKNOWN);

    }
  } else {

    // Missing type and / or body
    next(errors.ADD_ENTITY_MISSING_PARAMETERS);

  }
};

/**
 * Removes an entity.
 *
 * Expects the following url parameters :
 *  - **type** The type of the entity to remove
 *  - **id** The id of the entity to remove
 *
 * @method removeEntityAction
 * @static
 */
module.exports.removeEntityAction = function(request, response, next) {
  if (request.params.type && request.params.id) {
    var model = getEntityModel(request.params.type, request.user);

    if (model) {
      var arrayId = request.params.id.split(',');
      model.remove(arrayId, function(error, deleteCount) {
        if (error || (deleteCount != arrayId.length)) {
          next(errors.REMOVE_ENTITY_ERROR);
        } else {
          response.send({error: null, status: 'ok'});
        }
      });
    } else {

      // No model implemented for this type of entity
      next(errors.REMOVE_ENTITY_UNKNOWN);

    }
  } else {

    // Missing type and / or id of the entity
    next(errors.REMOVE_ENTITY_MISSING_PARAMETERS);

  }
};
