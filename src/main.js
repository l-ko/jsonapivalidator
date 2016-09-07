/**
 * Created by L on 07.09.16.
 */
'use strict';

let jrv = require('./jrv');
let _ = require('lodash');

module.exports = function (APIJSONSchema) {
  if (_.isUndefined(APIJSONSchema)) {
    throw new Error('No API schema provided');
  }

  let validator = {};

  // Parse schema
  _.forOwn(APIJSONSchema, function (value, key) {
    validator[key] = function (req) {
      return jrv(value, req);
    };
  });

  return validator;
};