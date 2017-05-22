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
instance.content.getAssets().then(( {assets} )=>{
    console.log("Got assets!", response);
});
```

#### Pagination and navigation
You can specify pagination parameters when requesting the assets. If ```navigation`````
parameter is not give, it will default to returning the first 25 assets.

```js
instance.content.getAssets({
    navigation : {
        page : 1,
        limit : 12
    }
}).then(({assets, navigation})=>{
    console.log("Got assets for page 1!", assets);
    console.log("Got total assets count!", navigation.total);
});
```

#### Basic Sorting
Sort the results:
```js
instance.content.getAssets({
    sorting : {
        by       : Digizuite.Constants.SORT_BY.DATE,
        direction: Digizuite.Constants.SORT_DIRECTION.ASCENDING
    }
}).then(({assets})=>{
    console.log("Got assets sorted!", assets);
});
```

If ```direction``` parameter is not provided, the default direction for the selected sort criteria will be used.

If there are no sorting instructions provided, the system default will be used. 


#### Advanced Sorting
Some systems offer additional sorting criteria. You can obtain them as follows:
```js
const sortCriteriaAvailable = instance.content.getSortBy();
```

Sort the results:
```js
instance.content.getAssets({
    sorting : {
        by       : sortCriteriaAvailable[0].by,
        direction: Digizuite.Constants.SORT_DIRECTION.ASCENDING
    }
}).then(({assets})=>{
    console.log("Got assets sorted!", assets);
});
```

If ```direction``` parameter is not provided, the default direction for the selected sort criteria will be used.

If there are no sorting instructions provided, the system default will be used. 


### Basic Filtering

Filter for an asset with a given name:
```js
const  assetNameFilter = new Digizuite.Search.AssetNameFilter({
    name : 'takeoff'
});
instance.content.getAssets({
    filters : [ assetNameFilter ]
}).then(({assets})=>{
    console.log("Got assets filtered!", assets);
});
```

Filter for an asset of an given type:
```js
const assetTypeFilter = new Digizuite.Search.AssetTypeFilter({
   types : [ Digizuite.Constants.ASSET_TYPE.Image ]
});
instance.content.getAssets({
    filters : [ assetTypeFilter ]
}).then(({assets})=>{
    console.log("Got assets filtered!", assets);
});
```

Filter for an asset created in a given time interval
```js
const assetCreatedFilter = new Digizuite.Search.AssetCreatedFilter({
    from : 1494720000,
    to : 1495459813
});
instance.content.getAssets({
    filters : [ assetCreatedFilter ]
}).then(({assets})=>{
    console.log("Got assets filtered!", assets);
});
```

In case ```from``` parameter is not provided, it will default to 0.

In case ```to``` parameter is not provided, it will default to current unix timestamp.


### Advanced Filtering(incomplete)

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

### Faceted Filtering(incomplete)
// TODO

## Copyright
Digizuite (C) 2017