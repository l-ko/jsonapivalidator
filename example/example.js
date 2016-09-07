/**
 * Created by L on 07.09.16.
 */
'use strict';

// Load API schema document
let yaml = require('js-yaml');
let fs = require('fs');
let apiDoc = yaml.safeLoad(fs.readFileSync('./API.yaml', 'utf8'));

// Load validator
let jarv = require('../src/main.js')(apiDoc);

// Use validator
jarv['createSmth']({
  id: '5784d4c5d793a5cc186f2c50',
  attributes: {
    name: 'asd',
    size: 170
  }
}).then(function () {
  console.log('OK')
}).catch(function (e) {
  console.error(e);
  /*
   [ { [Error: Parameter value exceeded the maximum of 150]
   code: 'ExceededMaximumValue',
   source: { pointer: '/attributes/size' } } ]
   */
});