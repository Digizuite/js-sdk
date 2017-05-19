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

### Getting assets

Obtain a list of assets: 
```js
instance.content.getAssets().then((response)=>{
    console.log("Got assets!", response);
});
```

### Getting available filters

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

After getting a list of asset, it is possible to obtain a filter of facet filters
```js
instance.content.getAssets({
    path : '/'
}).then((response)=>{
    console.log("Got facet!", instance.content.getFacetResult());
});
``` 

## Copyright
Digizuite (C) 2017