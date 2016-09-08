/**
 * Created by L on 08.09.16.
 */
'use strict';

let APISchema = {
  operation1: { // Operation name
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
          size1: {
            type: 'number',
            maximum: 150
          },
          size2: {
            type: 'number',
            maximum: 150,
            exclusiveMaximum: true
          },
          size3: {
            type: 'number',
            minimum: 150,
            exclusiveMinimum: false
          },
          size4: {
            type: 'number',
            minimum: 150,
            exclusiveMinimum: true
          },
          collection: {
            type: 'array',
            minItems: 2
          }
        }
      }
    }
  }
};

// Load validator
let validator = require('../src/main.js')(APISchema);

let should = require('should');

describe('Schema mismatch errors', function () {
  it('Should return error on property type mismatch', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50',
      attributes: {
        name: 123
      }
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('request parameter type is not supported');
      done();
    });
  });
  it('Should return error on array property being not array', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50',
      attributes: {
        collection: 'asd'
      }
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('request parameter type is not supported');
      done();
    });
  });
  it('Should return error on invalid BSON objectId type', function (done) {
    let req = {
      id: 'asd',
      attributes: {}
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('Invalid object id');
      done();
    });
  });
  it('Should return error if provided value is greater then the maximum', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50',
      attributes: {
        size1: 200
      }
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('Parameter value exceeded the maximum of 150');
      done();
    });
  });
  it('Should return error if provided value is equal to the strict maximum', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50',
      attributes: {
        size2: 150
      }
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('Parameter value exceeded the exclusive maximum of 150');
      done();
    });
  });
  it('Should return error if provided value is lower then the minimum', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50',
      attributes: {
        size3: 100
      }
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('Parameter value exceeded the minimum of 150');
      done();
    });
  });
  it('Should return error if provided value is equal to the the strict minimum', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50',
      attributes: {
        size4: 150
      }
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('Parameter value exceeded the exclusive minimum of 150');
      done();
    });
  });
  it('Should return error if required property not found', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50'
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('Required request parameter is not defined: attributes');
      done();
    });
  });
  it('Should return error if array property contains a smaller amount of items then minItems', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50',
      attributes: {
        collection: [1]
      }
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('Array property must contain at least 2 items');
      done();
    });
  });
  it('Should return error if array property does not contain any items but has a minItems', function (done) {
    let req = {
      id: '5784d4c5d793a5cc186f2c50',
      attributes: {
        collection: []
      }
    };
    validator['operation1'](req).then(function () {
      done(new Error('Should be an error'));
    }).catch(function (e) {
      e.should.be.an.Array();
      e[0].should.have.property('message');
      e[0].message.should.equal('Array property must contain at least 2 items');
      done();
    });
  });
});