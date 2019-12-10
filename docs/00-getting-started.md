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
    siteUrl : 'https://my-installation-of-ccc.com/',
}).then((instance)=>{
    return instance.connectWithCredentials('username', 'p@ssword');
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
    siteUrl : 'https://my-installation-of-ccc.com/',
}).then((instance)=> {
    const constants = instance.getConstants();
    if (constants.useFederatedAuthentication) {

        const ssoToken = someMethodToCheckIfYouHaveTheToken();

        if (!ssoToken) {
            const ssoUrl = instance.getSSOLoginUrl(window.location.href);
            // Redirect the user to ssoUrl for authentication
            return new Promise(() => {});
        } else {
            return instance.connectWithAccessKey(ssoToken);
        }

    } else {
        return instance.connectWithCredentials('username', 'p@ssword');
    }
}).then((instance)=>{
    console.log("Success!!!", instance);
    // instance can be used to interact with digizuite
}).catch((error)=>{
    console.log("Error!", error);
});
```

The resulted instance should be stored and used for all further interaction.

You should reuse the obtain instance and not get more than 1 instance for the same DAM center.

### Disposal of connector instance

The connector instance can be destroyed, when is not needed anymore:

```js
instance.destroy();
```

### Lighter imports
The `Connector` object is also available as import from `digizuite/src/connector`. 
