# Getting started 
This document describes how to get started with the Digizuite sdk. It's assumed that the reader 
knows how to pull a dependency from npm. 

The package is also available from cdn at `https://unpkg.com/digizuite/dist/digizuite.js`, 
in case npm is not available. 

## Imports
All examples in these docs uses ES2015 imports. Is ES2015 imports not available in 
your environment, then all variables exported from `digizuite` is available on the 
global `Digizuite` variable.

Lighter imports are also available for the majority of objects, and will be specified under 
the "Lighter imports" section. 

## Create a connector instance

Obtain an instance of the Digizuite Connector:

```js
import {Connector} from 'digizuite';

Connector.getConnectorInstance({
    apiUrl : 'https://my-installation-of-digizuite.com/dmm3bwsv3/',
    username : 'username',
    password : 'password'
}).then((instance)=>{
    console.log("Success!!!", instance);
    // instance can be used to interact with digizuite
}).catch((error)=>{
    console.log("Error!", error);
});
```

When the user are authenticated via SSO, the connector instance can be obtained as follows:
```js
import {Connector} from 'digizuite';

Connector.getConnectorInstance({
    apiUrl : 'https://my-installation-of-digizuite.com/dmm3bwsv3/',
    accessKey : 'access-key-returned-from-login-service',
}).then((instance)=>{
    console.log("Success!!!", instance);
    // instance can be used to interact with digizuite
}).catch((error)=>{
    console.log("Error!", error);
});
```

The resulted instance should be stored and used for all further interaction.

You should reuse the obtain instance and not get more than 1 instance for the same DAM center.

### Lighter imports
The `Connector` object is also available as import from `digizuite/src/connector`. 
