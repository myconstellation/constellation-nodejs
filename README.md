# constellation-nodejs
Constellation hub access from a Nodejs context

# Introduction

[Constellation] is a platform to orchestrate and interconnect your programs and devices. With constellation, you can easily manage all of your devices / sensors / switch and more, interconnect its and create intelligence between them.
You can read more on [Constellation] here : http://www.myconstellation.io/

This package was created, at the beginning on my needs to access Constellation Hub from my NodeJS home context.
The lack of reverse engineering on the Signal R javascript library is backed up with a DOM parallel context created with [JsDOM].

Any performances problem are noticed when I perftest it.

Don't hesitate to ask for an add, or just contribute.

# CHANGELOG : New version 2.0.0
* *2.0.0* now manage virtual entities (Sentinel and packages).
* Now you can push state object and emulate Sentinel from a Javascript Context.
* You can use the old initialization style *1.2.x* with this *2.0.0*

# Quick start

**Install in your app directory**

```shell
$ npm install constellation-nodejs
```

**Create configuration file in config directory from the sample attached**

Create a default.json file in /config directory.
Configuration file isn't necessary. You can instanciate the Hub from parameters.

```js
{
  /**
  * Constellation Configuration
  **/
  "constellation": {
    //// Constellation url
    "url" : "",
    //// Constellation Hub Access key
    "accessKey" : "",
    //// Your application name
    "applicationName" : "Test Node JS",
    ///// Sdk Version
    "sdkVersion" : "1.8.2"
  }
}
```

Config file is automaticaly checked before any initialization, *if you don't provide parameters to init() method*.
The config process is managed by the fantastic library [node-config]. You can manage your multiples environments with it.

**Access to the Constellation Hub context**
```javascript
    var ConstellationHub = require('constellation-nodejs');

	//// With config file
	var c = new ConstellationHub();

	//// Without configuration file 
	var c = new ConstellationHub(rootUrl, token, "AmbientSensor", "1.8.2"); //// AmbientSensor represents the name of the application (package)

	//// Create a Controller Hub
	c.Controller()
		.then((ctx) => {
			ctx.on('connected', () => { 
				console.log("CONNECTED"); 
				//ctx.hub.server.writelog("SentinelPI", "{ 'test' : 'ok' } "); 
			});
			return ctx.connect();
		});

	//// Create a Consumer Hub
	c.Consumer()
		.then((ctx) => {
			ctx.on('connected', () => { 
				console.log("CONNECTED"); 
				//// subscribe
				ctx.hub.client.registerStateObjectLink("R2D2", "Vera", "Flood Sensor (temperature)", "*", function (so) {
					console.log(so.Value.Temperature);
				});
			});
			return ctx.connect();
		});

	//// Create a Sentinel Hub
	c.Sentinel("Corulag")
		.then((ctx) => {
			ctx.on('connected', () => { 
				console.log("CONNECTED"); 
				ctx.hub.server.writelog("SentinelPI", "{ 'test' : 'ok' } "); 
			});
			return ctx.connect();
		});
```

# Contributions

Now it's on https://github.com/myconstellation/constellation-nodejs
