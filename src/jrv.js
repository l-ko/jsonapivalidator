/**
 * Created by L on 07.09.16.
 */
'use strict';

let _ = require('lodash');
let objectIdHelper = require('mongodb-objectid-helper');

class RError extends Error {
  constructor(code, title, pointer) {
    super(title);

    this.code = code;
    this.source = {
      pointer: pointer
    };
  }

  get stack() {
    return super.stack;
  }
}

module.exports = function (schema, obj) {
  let errors = [];
  let pointer = '';

  function validateData (schema, pointer, data) {
    if (schema.type === 'array') {
      if (!_.isArray(data)) {
        errors.push(new RError('TypeNotSupported', 'request parameter type is not supported', pointer));
        return Promise.resolve();
      }
    } else if (schema.type === 'objectId') {
      if (!objectIdHelper.isObjectId(data)) {
        errors.push(new RError('InvalidObjectId', 'Invalid object id', pointer));
        return Promise.resolve();
      }
    } else {
      if (schema.type !== typeof(data)) {
        errors.push(new RError('TypeNotSupported', 'request parameter type is not supported', pointer));
        return Promise.resolve();
      }
    }

    if (!_.isUndefined(schema.maximum)) {
      if (schema.exclusiveMaximum) {
        if (data >= schema.maximum) {
          errors.push(new RError('ExceededMaximumValue', 'Parameter value exceeded the exclusive maximum of ' + schema.maximum, pointer));
          return Promise.resolve();
        }
      } else {
        if (data > schema.maximum) {
          errors.push(new RError('ExceededMaximumValue', 'Parameter value exceeded the maximum of ' + schema.maximum, pointer));
          return Promise.resolve();
        }
      }
    }

    if (!_.isUndefined(schema.minimum)) {
      if (schema.exclusiveMinimum) {
        if (data <= schema.minimum) {
          errors.push(new RError('ExceededMinimumValue', 'Parameter value exceeded the exclusive minimum of ' + schema.minimum, pointer));
          return Promise.resolve();
        }
      } else {
        if (data < schema.minimum) {
          errors.push(new RError('ExceededMinimumValue', 'Parameter value exceeded the minimum of ' + schema.minimum, pointer));
          return Promise.resolve();
        }
      }
    }


    if (schema.type === 'object') {

      if (schema.properties) {
        if (schema.required) {
          schema.required.forEach(function (item) {
            if (_.isUndefined(data[item])) {
              errors.push(new RError('MissingRequestParameter', 'Required request parameter is not defined: ' + item, pointer));
            }
          });
        }
        let keys = [];
        _.forOwn(data, function (value, key) {
          if (schema.properties[key]) {
            keys.push(key);
          }
        });
        return Promise.all(keys.map(function (key) {
          return validateData(schema.properties[key], pointer + '/' + key, data[key]);
        }));
      }
    } else if (schema.type === 'array') {

      if (schema.items) {
        if (schema.minItems > schema.items.length) {
          errors.push(new RError('MissingArrayItems', 'Array property must contain at least ' + schema.minItems + ' items', pointer));
        }

        let keys = [];
        _.forOwn(data, function (value, key) {
          keys.push(key);
        });
        return Promise.all(keys.map(function (key) {
          validateData(schema.items, pointer + '/' + key, data[key]);
        }));
      } else {
        if (schema.minItems > 0) {
          errors.push(new RError('MissingArrayItems', 'Array property must contain at least ' + schema.minItems + ' items', pointer));
        }
      }
    }

    return Promise.resolve();
  }

  return validateData(schema, '', obj).then(function () {
    // Rethrow array of errors
    if (errors.length > 0) {
      return Promise.reject(errors);
    }
    return Promise.resolve(obj);
  });
}