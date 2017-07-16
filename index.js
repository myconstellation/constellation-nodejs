#!/usr/bin/env node
"use strict";

/**
 * Node.js : constellation-nodejs
 * Constellation context access from nodejs.
 *
 **/

var ConstellationContext = require('./lib/constellation.js');

var ConstellationFactory = function(url, accessKey, applicationName, sdkVersion) {
    var ctx = new ConstellationContext();
    this.Sentinel = function(sentinelName) {
        return ctx.init(url, accessKey, applicationName, sdkVersion)
            .then(() => {
                return ctx.getPackageHub(sentinelName);
            });
    }

    this.Controller = function() {
        return ctx.init(url, accessKey, applicationName, sdkVersion)
            .then(() => {
                return ctx.getControllerHub();
            });
    }

    this.Consumer = function() {
        return ctx.init(url, accessKey, applicationName, sdkVersion)
            .then(() => {
                return ctx.getConsumerHub();
            });
    }
}

module.exports = ConstellationFactory;