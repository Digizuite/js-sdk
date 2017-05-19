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
### Obtaining a list of folder
```js
instance.content.getFolders({
    path : '/'
}).then((response)=>{
    console.log("Got folders!", response);
});
```

You can use ```'/'``` as the root folder. Each folder contains a ```path``` propriety, 
which can be used to as a parameter to obtain a list of sub-folders.

### Filtering

Obtain a list of filters: 
```js
instance.content.getFilters().then((response)=>{
    console.log("Got filters!", response);
});
```

All the filter type can be found in the constants class.
```js
console.log( Digizuite.Constants.FILTER_TYPE )
``` 

## Copyright
Digizuite (C) 2017