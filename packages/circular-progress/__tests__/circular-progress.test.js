'use strict';

const circularProgress = require('..');
const assert = require('assert').strict;

assert.strictEqual(circularProgress(), 'Hello from circularProgress');
console.info('circularProgress tests passed');
