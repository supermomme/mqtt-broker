const assert = require('assert');
const app = require('../../src/app');

describe('\'retain-match\' service', () => {
  it('registered the service', () => {
    const service = app.service('retain-match');

    assert.ok(service, 'Registered the service');
  });
});
