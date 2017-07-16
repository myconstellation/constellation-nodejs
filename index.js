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
                return ctx.getPackageHub(url, accessKey, applicationName, sentinelName);
            });
    }

    this.Controller = function() {
        return ctx.init(url, accessKey, applicationName, sdkVersion)
            .then(() => {
                return ctx.getControllerHub(url, accessKey, applicationName, sentinelName);
            });
    }

    this.Consumer = function() {
        return ctx.init(url, accessKey, applicationName, sdkVersion)
            .then(() => {
                return ctx.getConsumerHub(url, accessKey, applicationName);
            });
    }
}

module.exports = ConstellationFactory;