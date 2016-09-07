# JRV

Validates JSON requests against provided API schema. Uses OpenAPI schema definition format. Returns an array of error objects with pointers.

This can be used if you want a requests validation mechanism similar to OpenAPI, but don't want to install their tools for some reason.

Supports ObjectId type.

```
var APISchema = {
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