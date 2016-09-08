## Overview

Validates JSON requests against provided API schema. Returns an array of error objects with pointers.

Generally, this module derived from an inability to effectively validate JSON requests received by micro service over MQTT instead of HTTP.
So there was a need for validation mechanism similar to one provided by OpenAPI tools.

Supports ObjectId type.

## Warning
1) Schema is not validated itself on module load at the moment.

2) Not all of the schema definition features are implemented. 
It understands objects, arrays, minItems, minimum/maximum, exclusiveMinimum/exclusiveMaximum though.

Check out the test folder. It should contain a test for every supported feature.

## Example
Following example uses API definition with a single defined operation 'createSmth'. 
When the module is loaded it provides an object with a 'createSmth' property, which is a function from request. 
More operations you have, more properties will be attached to a validator object, which can be further utilized in a single manner. 

```
let APISchema = {
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