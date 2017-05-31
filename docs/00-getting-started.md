# Getting started 

## Create a connector instance

Obtain an instance of the Digizuite Connector:

```js
Digizuite.Connector.getConnectorInstance({
    apiUrl : 'https://my-installation-of-digizuite.com/dmm3bwsv3/',
    username : 'username',
    password : 'password'
}).then((instance)=>{
    console.log("Success!", instance);
    // instance can be used to interact with digizuite
}).catch((error)=>{
    console.log("Error!", error);
});
```

The resulted instance should be stored and used for all further interaction.

You should reuse the obtain instance and not get more than 1 instance for the same DAM center.