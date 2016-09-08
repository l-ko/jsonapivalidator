## Overview

Validates JSON requests against provided API schema. Uses OpenAPI schema definition format. Returns an array of error objects with pointers.

This can be used if you want a requests validation mechanism similar to OpenAPI, but don't want to install their tools for some reason.

Supports ObjectId type.

## Warning
1) Schema is not validated itself on module load at the moment.

2) Not all of the OpenAPI schema definition features are implemented. 
It understands objects, arrays, minimum/maximum, exclusiveMinimum/exclusiveMaximum though.

## Example
Following example uses API definition with a single defined operation 'createSmth'. 
When the module is loaded it provides an object with a 'createSmth' property, which is a function from request. 
More operations you have, more properties will be attached to a validator object, which can be further utilized in a single manner. 

```
var APISchema = {
    createSmth: { // Operation name
      type: 'object',
      required: ['id', 'attributes'],
      properties: {
        id: {
          type: 'objectId'
        },
        attributes: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            size: {
              type: 'number',
              maximum: 150
            }
          }
        }
      }
    }
};

// Load validator
let validator = require('jsonreqvalidator')(APISchema);

// Example request
let req = {
    id: '5784d4c5d793a5cc186f2c50',
    attributes: {
      name: 'asd',
      size: 170
    }
};

// Use validator
validator['createSmth'](req).then(function (req) {
  console.log('OK')
}).catch(function (e) {
  console.error(e);
  /*
   [ { [Error: Parameter value exceeded the maximum of 150]
   code: 'ExceededMaximumValue',
   source: { pointer: '/attributes/size' } } ]
   */
});
```

## Related
* https://openapis.org/
* http://jsonapi.org/format/#error-objects
* https://tools.ietf.org/html/rfc6901