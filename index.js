#!/usr/bin/env node
"use strict";

/**
 * Node.js : constellation-nodejs
 * Constellation context access from nodejs.
 *
 **/

var ConstellationContext = require('./lib/constellation.js');

//// Checking config before init
var context = new ConstellationContext();
module.exports = context.check().init();