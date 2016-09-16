# constellation-nodejs
Constellation hub access from a Nodejs context

# Introduction

[Constellation] is an oriented message bus for domotic use. With constellation, you can easily manage all of your devices / sensors / switch and more, interconnect its and create intelligence between them.
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
    "sdkVersion" : "1.8.0"
  }
}
```

Config file is automaticaly checked before any initialization. 
The config process is managed by the fantastic library [node-config]. You can manage your multiples environments with it. 

**Access to the Constellation Hub context**
```js
    var constellation = require('constellation-nodejs');

    //// Listen activity
    constellation.consumerHub.connection.stateChanged(function (change) {
        if (change.newState === $.signalR.connectionState.connected) {
            console.log("Je suis connecté");
        }
    });

    //// Connect to your hub
    var hub = constellation.connect();

    //// You can access to the hub instance through constellation.consumerHub

    //// Register a state object
    constellation.consumerHub.server.requestSubscribeStateObjects("R2D2", "Vera", "Flood Sensor (temperature)", "*");

    //// Request updates
	constellation.client.onUpdateStateObject(function (stateobject) {
		console.log(stateobject.Value.Temperature);
	});
```

# Contributions

Feel free to ask or contribute directly on this repo. 
