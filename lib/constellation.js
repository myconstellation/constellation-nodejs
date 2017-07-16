#!/usr/bin/env node
"use strict";

/**
 * Node.js : constellation-nodejs
 * Constellation context access from nodejs.
 *
 **/

var config = require('config');

const util = require('util');
const jsdom = require('jsdom');
const window = jsdom.jsdom().defaultView;
const EventEmitter = require('events').EventEmitter;

const cdn = {
    jquery : 'http://code.jquery.com/jquery-2.2.2.min.js',
    signalr : 'http://ajax.aspnetcdn.com/ajax/signalr/jquery.signalr-2.2.0.min.js',
    constellation : 'https://cdn.myconstellation.io/js/Constellation-%s.min.js'
};

const HubType = {
    "PACKAGE" : "Package",
    "CONTROLLER" : "Controller",
    "CONSUMER" : "Consumer"
}

var ConstellationContext = function ()
{
    var self = this;

    this.eventhub = new EventEmitter();

    this.EVENTS = {
        onConnectionStateChange : "connection.change",
        onConnected : "connected",
        onDisconnected : "disconnected"
    };

    this.requiredConfigurationKeys = [
        "constellation",
        "constellation.url",
        "constellation.accessKey",
        "constellation.applicationName",
        "constellation.sdkVersion"
    ];

    this.check = function() {

        for(var i = 0; i < this.requiredConfigurationKeys.length; i++)
        {
            if(!config.has(this.requiredConfigurationKeys[i]))
            {
                throw new Error(util.format("Please check your configuration file. Key : %s is missing.", this.requiredConfigurationKeys[i]));
            }
        }

        return true;
    };

    this.init = function(url, accessKey, applicationName, sdkVersion) {
        var that = this;
        this.loadConfig.apply(this, arguments);
        return this.loadDomContext();
    };

    this.on = (evt, callback) => self.eventhub.on(evt, callback);

    this.loadConfig = function(url, accesskey, applicationName, sdkVersion) {
        var that = this;

        if(arguments.length === 0)
        {
            //// load config file
            that.check();

            //// init
            url = config.get(that.requiredConfigurationKeys[1]);
            accesskey = config.get(that.requiredConfigurationKeys[2]);
            applicationName = config.get(that.requiredConfigurationKeys[3]);
            sdkVersion = config.get(that.requiredConfigurationKeys[4]);
        }

        if (!url || !accesskey || !applicationName)
            throw new Error("Please check your configuration variable. You can use a file or parameters on the init function.");

        that.url = url;
        that.accessKey = accesskey;
        that.applicationName = applicationName;
        that.sdkVersion = sdkVersion || "1.8.2";
    };

    this.loadDomContext = function () {
        var that = this;

        //// Loading Jquery / SignalR / Constellation JS proxy
        return new Promise((resolve, reject) => {
            jsdom.jQueryify(
				window,
				cdn.jquery,
				() => {
	                that.loadScript(cdn.signalr)
	                    .then(() => that.loadScript(util.format(cdn.constellation, that.sdkVersion)))
	                    .then(() => resolve())
	                    .catch((error) => { console.log('error', error); reject();
				});
            });
        });
    };

    this.loadScript = function (src) {
        return new Promise((resolve, reject) => {
            let script = window.document.createElement('script');
            script.src = src;

            window.document.body.appendChild(script);

            script.onload = (e) => resolve(e);
            script.onerror = (err) => reject(err);
        });
    };

    this.createHub = function (type, params) {
        var $ = self.$ = window.$;
        self.hub = self.hub || $.hubConnection['createConstellation' + type](url, sentinelName, packageName, accessKey);
        self[type.toLowerCase() + 'Hub'] = self.hub;
        return self;
    };

    this.getPackageHub = function(url, accessKey, appName, sentinelName) {
        //return this.createHub(HubType.PACKAGE, {url : url, sentinelName : sentinelName, packageName : appName, accessKey : accessKey });
        var $ = self.$ = window.$;
        self.hub = self.hub || $.signalR['createConstellationPackage'](url, sentinelName, appName, accessKey);
        self['packageHub'] = self.hub;
        return self;
    };

    this.getControllerHub = function(url, accessKey, appName) {
        return this.createHub(HubType.CONTROLLER, { url : url, accessKey : accessKey, appName : appName });
    };

    this.getConsumerHub = function(url, accessKey, appName) {
        return this.createHub(HubType.CONSUMER, { url : url, accessKey : accessKey, appName : appName });
    };

    this.connect = function () {

        var that = self;
        var $ = self.$;

        if (!self.hub)
            throw new Error("You must create hub before trying to connect.");

        return new Promise((resolve, reject) => {
            that.hub.connection.stateChanged(function (change) {
                that.eventhub.emit(that.EVENTS.onConnectionStateChange, change);

                switch (change.newState) {
                    case $.signalR.connectionState.connected :
                        that.eventhub.emit(that.EVENTS.onConnected, change);
                        resolve(that.hub);
                        break;
                    case $.signalR.connectionState.disconnected :
                        that.eventhub.emit(that.EVENTS.onDisconnected, change);
                        break;
                }
            });

            that.hub.connection.start();
        });
    };
};

module.exports = ConstellationContext;
