# constellation-nodejs
Constellation hub access from a Nodejs context

# Introduction

[Constellation] is a platform to orchestrate and interconnect your programs and devices. With constellation, you can easily manage all of your devices / sensors / switch and more, interconnect its and create intelligence between them.
You can read more on [Constellation] here : http://www.myconstellation.io/

This package was created, at the beginning on my needs to access Constellation Hub from my NodeJS home context.
The lack of reverse engineering on the Signal R javascript library is backed up with a DOM parallel context created with [JsDOM].

Any performances problem are noticed when I perftest it.

Don't hesitate to ask for an add, or just contribute.


# Quick start

**Install in your app directory**

```shell
$ npm install constellation-nodejs
```

**Create configuration file in config directory from the sample attached**

Create a default.json file in /config directory.

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
    "sdkVersion" : "1.8.1"
  }
}
```

Config file is automaticaly checked before any initialization, if you don't provide parameters to init() method.
The config process is managed by the fantastic library [node-config]. You can manage your multiples environments with it.

**Access to the Constellation Hub context**
```javascript
    var constellation = require('constellation-nodejs');

	//// Init with config file and wait until initialization is completed
	constellation.init()
		.then(function(hub) {
			//// Init OK
			console.log("Init OK.");
			return hub;
		}).then((hub) => {
			//// connect
			hub.on('connected', () => { console.log("Connected to constellation hub.");})
			return hub.connect();
		}).then((hub) => {
			//// subscribe
			hub.client.registerStateObjectLink("R2D2", "Vera", "Flood Sensor (temperature)", "*", function (so) {
				console.log(so.Value.Temperature);
			});
		});
```

** You can also configure the context through init parameters (no config file needed).
```javascript
this.init = function(url, accessKey, applicationName, sdkVersion)
```

# Contributions

Now it's on https://github.com/myconstellation/constellation-nodejs
