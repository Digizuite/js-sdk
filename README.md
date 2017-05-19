# Digizuite Drive

## Requirements
* NodeJS v6 or greater

## Build
```
npm install
npm run dist
```

## Usage

### Create a connector instance
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
## Copyright
Digizuite (C) 2017